import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import REST from '../utils/REST';

import {
  Button,
  Typography,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import CenteredContainer from '../component/CenteredContainer';
import Input from './Input';
import { useInput } from './hooks/useInput';
import StyledPaper from '../component/StyledPaper';

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
    console.error("Registration failed:", error);
    
    // Wyczyść poprzednie błędy pól
    setFieldErrors({});
    
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
      // Jeśli mamy błędy walidacji pól
      if (errorData.fieldErrors && Array.isArray(errorData.fieldErrors)) {
        const newFieldErrors = {};
        let errorMessages = [];
        
        errorData.fieldErrors.forEach(fieldError => {
          newFieldErrors[fieldError.field] = fieldError.message;
          errorMessages.push(`${fieldError.field}: ${fieldError.message}`);
        });
        
        setFieldErrors(newFieldErrors);
        setError(`Błędy walidacji: ${errorMessages.join(', ')}`);
      }
      // Jeśli mamy ogólny komunikat błędu
      else if (errorData.message) {
        setError(errorData.message);
      }
      // Fallback na kod błędu
      else if (errorData.code) {
        setError(`Błąd: ${errorData.code}`);
      }
      else {
        setError('Wystąpił nieznany błąd serwera.');
      }
    }
    // Jeśli nie ma szczegółów odpowiedzi
    else if (error.message) {
      setError(error.message);
    }
    else {
      setError('Rejestracja nie powiodła się.');
    }
  };

  const submitSignUpReq = async () => {
    // Sprawdź wszystkie pola przed wysłaniem (dodane nowe pola)
    if (nameIsInvalid || surnameIsInvalid || usernameIsInvalid || emailIsInvalid || passwordIsInvalid || confirmPasswordIsInvalid) {
      setError('Proszę poprawić błędy w formularzu.');
      return;
    }

    if (!enteredName || !enteredSurname || !enteredUsername || !enteredEmail || !enteredPassword || !enteredConfirmPassword) {
      setError('Proszę wypełnić wszystkie pola.');
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
      password: enteredPassword
    };

    try {
      const response = await REST.registerUser(userDetails);
      setSuccess(response.message);
      setShowSuccessMessage(true);
      
      // Automatyczne przekierowanie po 10 sekundach
      setTimeout(() => {
        navigate('/login');
      }, 10000);
      
    } catch (err) {
      processBackendError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!enteredEmail) {
      setError('Proszę podać adres email.');
      return;
    }

    try {
      await REST.resendVerificationEmail(enteredEmail);
      setSuccess('Email weryfikacyjny został wysłany ponownie.');
    } catch (err) {
      setError('Błąd podczas wysyłania emaila weryfikacyjnego.');
    }
  };

  if (showSuccessMessage) {
    return (
      <CenteredContainer>
        <StyledPaper sx={{ maxWidth: 600, width: '100%' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">Rejestracja pomyślna!</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {success}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Zostaniesz przekierowany do strony logowania za chwilę...
            </Typography>
          </Alert>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleResendVerification}
              fullWidth
            >
              Wyślij ponownie email weryfikacyjny
            </Button>
            
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              fullWidth
            >
              Przejdź do logowania
            </Button>
          </Box>
        </StyledPaper>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <StyledPaper sx={{ maxWidth: 600, width: '100%' }}>
        <Typography variant="h5" component="div" sx={{ mb: 1 }}>
          {t('signup.title')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {t('signup.alreadyHaveAccount')} <a href="/login">{t('signup.login')}</a>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2}>
          {/* Nowe pola: Imię i Nazwisko obok siebie na większych ekranach */}
          <Grid xs={12} sm={6}>
            <Input
              label="Imię"
              id="name"
              name="name"
              onBlur={handleNameBlur}
              onChange={handleNameChange}
              value={enteredName}
              error={(nameIsInvalid && 'Imię musi mieć co najmniej 2 znaki') || fieldErrors.name}
            />
          </Grid>

          <Grid xs={12} sm={6}>
            <Input
              label="Nazwisko"
              id="surname"
              name="surname"
              onBlur={handleSurnameBlur}
              onChange={handleSurnameChange}
              value={enteredSurname}
              error={(surnameIsInvalid && 'Nazwisko musi mieć co najmniej 2 znaki') || fieldErrors.surname}
            />
          </Grid>

          <Grid xs={12}>
            <Input
              label={t('signup.username')}
              id="username"
              name="username"
              onBlur={handleUsernameBlur}
              onChange={handleUsernameChange}
              value={enteredUsername}
              error={(usernameIsInvalid && t('signup.usernameError')) || fieldErrors.username}
            />
          </Grid>

          <Grid xs={12}>
            <Input
              label={t('signup.email')}
              id="email"
              name="email"
              type="email"
              onBlur={handleEmailBlur}
              onChange={handleEmailChange}
              value={enteredEmail}
              error={(emailIsInvalid && t('signup.emailError')) || fieldErrors.email}
            />
          </Grid>

          <Grid xs={12}>
            <Input
              label={t('signup.password')}
              id="password"
              name="password"
              type="password"
              onBlur={handlePasswordBlur}
              onChange={handlePasswordChange}
              value={enteredPassword}
              error={(passwordIsInvalid && 'Hasło musi mieć co najmniej 6 znaków') || fieldErrors.password}
            />
          </Grid>

          <Grid xs={12}>
            <Input
              label={t('signup.confirmPassword')}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onBlur={handleConfirmPasswordBlur}
              onChange={handleConfirmPasswordChange}
              value={enteredConfirmPassword}
              error={(confirmPasswordIsInvalid && t('signup.confirmPasswordError')) || fieldErrors.confirmPassword}
            />
          </Grid>

          <Grid xs={12}>
            <Button 
              variant="contained" 
              fullWidth
              size="large"
              onClick={submitSignUpReq}
              disabled={isLoading}
              sx={{ mt: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : t('signup.signUp')}
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>
    </CenteredContainer>
  );
}