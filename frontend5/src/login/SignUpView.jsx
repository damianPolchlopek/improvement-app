import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import REST from '../utils/REST';

import { Alert, Box, Button, CircularProgress, Link, Typography } from '@mui/material';
import { MarkEmailRead, PersonAdd } from '@mui/icons-material';

import AuthCard from './AuthCard';
import { LoginUrl } from '../utils/URLHelper';
import Input from './Input';
import { useInput } from './hooks/useInput';

export default function SignUpView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Dodane nowe pola: name i surname
  const {
    value: enteredName,
    handleInputChange: handleNameChange,
    handleInputBlur: handleNameBlur,
    hasError: nameIsInvalid,
  } = useInput('', (value) => value.trim().length >= 2);

  const {
    value: enteredSurname,
    handleInputChange: handleSurnameChange,
    handleInputBlur: handleSurnameBlur,
    hasError: surnameIsInvalid,
  } = useInput('', (value) => value.trim().length >= 2);

  const {
    value: enteredUsername,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameIsInvalid,
  } = useInput('', (value) => value.trim() !== '');

  const {
    value: enteredEmail,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailIsInvalid,
  } = useInput('', (value) => value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));

  const {
    value: enteredPassword,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordIsInvalid,
  } = useInput('', (value) => value.length >= 6); // Poprawione na 6 znaków zgodnie z helperText

  const {
    value: enteredConfirmPassword,
    handleInputChange: handleConfirmPasswordChange,
    handleInputBlur: handleConfirmPasswordBlur,
    hasError: confirmPasswordIsInvalid,
  } = useInput('', (value) => value === enteredPassword);

  // Funkcja do przetwarzania błędów z backendu
  const processBackendError = (error) => {
    console.error('Registration failed:', error);

    // Wyczyść poprzednie błędy pól
    setFieldErrors({});

    if (error.response && error.response.data) {
      const errorData = error.response.data;

      // Jeśli mamy błędy walidacji pól
      if (errorData.fieldErrors && Array.isArray(errorData.fieldErrors)) {
        const newFieldErrors = {};
        let errorMessages = [];

        errorData.fieldErrors.forEach((fieldError) => {
          newFieldErrors[fieldError.field] = fieldError.message;
          errorMessages.push(`${fieldError.field}: ${fieldError.message}`);
        });

        setFieldErrors(newFieldErrors);
        setError(t('signup.validationErrors', { errors: errorMessages.join(', ') }));
      }
      // Jeśli mamy ogólny komunikat błędu
      else if (errorData.message) {
        setError(errorData.message);
      }
      // Fallback na kod błędu
      else if (errorData.code) {
        setError(t('signup.errorWithCode', { code: errorData.code }));
      } else {
        setError(t('signup.unknownServerError'));
      }
    }
    // Jeśli nie ma szczegółów odpowiedzi
    else if (error.message) {
      setError(error.message);
    } else {
      setError(t('signup.registrationFailed'));
    }
  };

  const submitSignUpReq = async () => {
    // Sprawdź wszystkie pola przed wysłaniem (dodane nowe pola)
    if (
      nameIsInvalid ||
      surnameIsInvalid ||
      usernameIsInvalid ||
      emailIsInvalid ||
      passwordIsInvalid ||
      confirmPasswordIsInvalid
    ) {
      setError(t('signup.fixFormErrors'));
      return;
    }

    if (
      !enteredName ||
      !enteredSurname ||
      !enteredUsername ||
      !enteredEmail ||
      !enteredPassword ||
      !enteredConfirmPassword
    ) {
      setError(t('signup.fillAllFields'));
      return;
    }

    setIsLoading(true);
    setError('');
    setFieldErrors({});

    const userDetails = {
      name: enteredName,
      surname: enteredSurname,
      username: enteredUsername,
      email: enteredEmail,
      password: enteredPassword,
    };

    try {
      const response = await REST.registerUser(userDetails);
      setSuccess(response.message);
      setShowSuccessMessage(true);

      // Automatyczne przekierowanie po 10 sekundach
      setTimeout(() => {
        navigate(LoginUrl);
      }, 10000);
    } catch (err) {
      processBackendError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!enteredEmail) {
      setError(t('signup.emailRequired'));
      return;
    }

    try {
      await REST.resendVerificationEmail(enteredEmail);
      setSuccess(t('signup.resendSuccess'));
    } catch {
      setError(t('signup.resendError'));
    }
  };

  const footer = (
    <>
      {t('signup.alreadyHaveAccount')}{' '}
      <Link component={RouterLink} to={LoginUrl} underline="hover">
        {t('signup.login')}
      </Link>
    </>
  );

  if (showSuccessMessage) {
    return (
      <AuthCard title={t('signup.successTitle')} maxWidth={520} footer={footer}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <MarkEmailRead sx={{ fontSize: 48, color: 'status.done', mb: 1 }} />
          <Typography sx={{ mb: 1 }}>{success}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('signup.redirectInfo')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
          <Button variant="outlined" onClick={handleResendVerification} fullWidth>
            {t('signup.resendEmailButton')}
          </Button>
          <Button variant="contained" onClick={() => navigate(LoginUrl)} fullWidth>
            {t('signup.goToLogin')}
          </Button>
        </Box>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('signup.title')}
      description={t('signup.description')}
      maxWidth={520}
      footer={footer}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submitSignUpReq();
        }}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          columnGap: 1.5,
          rowGap: 0.5,
        }}
      >
        <Input
          label={t('signup.name')}
          id="name"
          name="name"
          autoComplete="given-name"
          autoFocus
          onBlur={handleNameBlur}
          onChange={handleNameChange}
          value={enteredName}
          error={(nameIsInvalid && t('signup.nameError')) || fieldErrors.name}
        />
        <Input
          label={t('signup.surname')}
          id="surname"
          name="surname"
          autoComplete="family-name"
          onBlur={handleSurnameBlur}
          onChange={handleSurnameChange}
          value={enteredSurname}
          error={(surnameIsInvalid && t('signup.surnameError')) || fieldErrors.surname}
        />
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Input
            label={t('signup.username')}
            id="username"
            name="username"
            autoComplete="username"
            onBlur={handleUsernameBlur}
            onChange={handleUsernameChange}
            value={enteredUsername}
            error={(usernameIsInvalid && t('signup.usernameError')) || fieldErrors.username}
          />
        </Box>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Input
            label={t('signup.email')}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            value={enteredEmail}
            error={(emailIsInvalid && t('signup.emailError')) || fieldErrors.email}
          />
        </Box>
        <Input
          label={t('signup.password')}
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          onBlur={handlePasswordBlur}
          onChange={handlePasswordChange}
          value={enteredPassword}
          error={(passwordIsInvalid && t('signup.passwordError')) || fieldErrors.password}
        />
        <Input
          label={t('signup.confirmPassword')}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          onBlur={handleConfirmPasswordBlur}
          onChange={handleConfirmPasswordChange}
          value={enteredConfirmPassword}
          error={
            (confirmPasswordIsInvalid && t('signup.confirmPasswordError')) ||
            fieldErrors.confirmPassword
          }
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <PersonAdd />}
          sx={{ gridColumn: '1 / -1', mt: 0.5 }}
        >
          {t('signup.signUp')}
        </Button>
      </Box>
    </AuthCard>
  );
}
