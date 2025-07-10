import React, { useState, useEffect } from 'react';
import REST from '../utils/REST';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useInput } from './hooks/useInput';
import Input from './Input';
import CenteredContainer from '../component/CenteredContainer';
import StyledPaper from '../component/StyledPaper';
import { redirect, Form, useActionData, useNavigation } from 'react-router-dom';
import { setTokens } from './Authentication';
import { HomeViewUrl } from '../utils/URLHelper';
import { 
  getErrorInfo, 
  getResendMessages, 
  handleLoginError, 
  validateRequiredFields, 
  handleTokenValidationError 
} from '../utils/errorSystem';

export default function LoginView() {
  const { t } = useTranslation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [errorVisible, setErrorVisible] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(null);

  // Pobieranie komunikatów resend
  const resendMessages = getResendMessages(t);

  useEffect(() => {
    if (actionData?.error) {
      setErrorVisible(true);
      setResendSuccess(false);
      setResendError(null);
    }
  }, [actionData?.error]);

  // Funkcja do ponownego wysłania maila weryfikacyjnego
  const handleResendEmail = async () => {
    if (!enteredUsername.trim()) {
      setResendError(resendMessages.error.noUsername);
      return;
    }

    setResendingEmail(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      await REST.resendVerificationEmail({ username: enteredUsername });
      setResendSuccess(true);
      setResendError(null);
    } catch (error) {
      console.error('Resend email failed:', error);
      setResendError(
        error.response?.data?.message || resendMessages.error.failed
      );
    } finally {
      setResendingEmail(false);
    }
  };

  const {
    value: enteredUsername,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameIsInvalid,
  } = useInput('', (value) => value.trim() !== '');

  const {
    value: enteredPassword,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordIsInvalid,
  } = useInput('', (value) => value.trim() !== '');

  // Funkcja do renderowania błędów
  const renderError = () => {
    if (!actionData?.error) return null;

    const { code, message, details } = actionData.error;
    const errorInfo = getErrorInfo(code, t);

    return (
      errorVisible && (
        <Alert
          severity={errorInfo.severity}
          sx={{
            mb: 2,
            textAlign: 'center'
          }}
          onClose={() => setErrorVisible(false)}
        >
          <strong>{errorInfo.title}</strong><br />
          {message || errorInfo.message}
          {details && <><br /><small>{details}</small></>}

          {/* Przycisk resend dla błędu niezweryfikowanego emaila */}
          {errorInfo.showResendButton && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleResendEmail}
                disabled={resendingEmail}
                sx={{ minWidth: '140px' }}
              >
                {resendingEmail ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    {resendMessages.button.sending}
                  </>
                ) : (
                  resendMessages.button.text
                )}
              </Button>
            </Box>
          )}
        </Alert>
      )
    );
  };

  // Funkcja do renderowania komunikatu o sukcesie resend
  const renderResendSuccess = () => {
    if (!resendSuccess) return null;

    return (
      <Alert
        severity="success"
        sx={{
          mb: 2,
          textAlign: 'center'
        }}
        onClose={() => setResendSuccess(false)}
      >
        <strong>{resendMessages.success.title}</strong><br />
        {resendMessages.success.message}
      </Alert>
    );
  };

  // Funkcja do renderowania błędu resend
  const renderResendError = () => {
    if (!resendError) return null;

    return (
      <Alert
        severity="error"
        sx={{
          mb: 2,
          textAlign: 'center'
        }}
        onClose={() => setResendError(null)}
      >
        <strong>{resendMessages.error.title}</strong><br />
        {resendError}
      </Alert>
    );
  };

  return (
    <CenteredContainer>
      <StyledPaper>
        <Form method="post">
          <Grid container>
            <Grid xs={12}>
              <Typography variant="h5" component="div">
                {t('login.loginPanel')}
              </Typography>
            </Grid>

            {/* Wyświetlanie błędów */}
            <Grid xs={12}>
              {renderResendSuccess()}
              {renderResendError()}
              {renderError()}
            </Grid>

            <Grid xs={12}>
              <Input
                label={t('login.username')}
                id="username"
                name="username"
                onBlur={handleUsernameBlur}
                onChange={handleUsernameChange}
                value={enteredUsername}
                error={usernameIsInvalid && t('login.validation.usernameRequired', 'Wprowadź prawidłowy login!')}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid xs={12}>
              <Input
                label={t('login.password')}
                id="password"
                name="password"
                type="password"
                onBlur={handlePasswordBlur}
                onChange={handlePasswordChange}
                value={enteredPassword}
                error={passwordIsInvalid && t('login.validation.passwordRequired', 'Wprowadź prawidłowe hasło!')}
                disabled={isSubmitting}
              />
            </Grid>

            <Grid xs={12}>
              <Button
                variant="contained"
                sx={{ width: '25vh' }}
                type='submit'
                disabled={isSubmitting || usernameIsInvalid || passwordIsInvalid}
              >
                {isSubmitting ? t('login.submitting', 'Logowanie...') : t('login.submit')}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </StyledPaper>
    </CenteredContainer>
  );
}

export async function action({ request }) {
  const data = await request.formData();

  const userDetails = {
    username: data.get('username'),
    password: data.get('password')
  };

  // Walidacja po stronie serwera
  const validationError = validateRequiredFields(userDetails, ['username', 'password']);
  if (validationError) {
    return validationError;
  }

  try {
    const res = await REST.loginUser(userDetails);

    // Walidacja odpowiedzi z serwera
    if (!res.token || !res.type) {
      throw new Error('Invalid server response');
    }

    const accessToken = res.token;
    const refreshToken = res.refreshToken;
    const tokenType = res.type;

    try {
      setTokens(accessToken, refreshToken, tokenType, res.roles);
    } catch (tokenError) {
      return handleTokenValidationError(tokenError);
    }

    return redirect(HomeViewUrl);

  } catch (err) {
    return handleLoginError(err);
  }
}