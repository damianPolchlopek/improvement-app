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

export default function LoginView() {
  const { t } = useTranslation();
  const actionData = useActionData(); // Pobieranie danych z action
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [errorVisible, setErrorVisible] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(null);

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
      setResendError(t('login.errors.resend.noUsername', 'Wprowadź swój login/email'));
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
        error.response?.data?.message || 
        t('login.errors.resend.failed', 'Nie udało się wysłać emaila weryfikacyjnego')
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
    
    // Mapowanie kodów błędów na wiadomości dla użytkownika
    const errorMessages = {
      'EMAIL_NOT_VERIFIED': {
        severity: 'warning',
        title: t('login.errors.emailNotVerified.title', 'Email nie został zweryfikowany'),
        message: t('login.errors.emailNotVerified.message', 'Sprawdź swoją skrzynkę e-mail i kliknij link aktywacyjny.')
      },
      'INVALID_CREDENTIALS': {
        severity: 'error',
        title: t('login.errors.invalidCredentials.title', 'Nieprawidłowe dane'),
        message: t('login.errors.invalidCredentials.message', 'Sprawdź login i hasło.')
      },
      'ACCOUNT_LOCKED': {
        severity: 'error',
        title: t('login.errors.accountLocked.title', 'Konto zablokowane'),
        message: t('login.errors.accountLocked.message', 'Skontaktuj się z administratorem.')
      }
    };

    const errorInfo = errorMessages[code] || {
      severity: 'error',
      title: t('login.errors.generic.title', 'Błąd logowania'),
      message: message || t('login.errors.generic.message', 'Wystąpił nieoczekiwany błąd.')
    };

    return (
      errorVisible &&
      <Alert 
        severity={errorInfo.severity} 
        sx={{ 
          mb: 2,
          textAlign: 'center',
          '& .MuiAlert-message': {
            width: '100%',
            textAlign: 'center'
          }
        }}
        onClose={() => setErrorVisible(false)}
      >
        <strong>{errorInfo.title}</strong><br />
        {errorInfo.message}
        {details && <><br /><small>{details}</small></>}
        
        {/* Przycisk resend dla błędu niezweryfikowanego emaila */}
        {code === 'EMAIL_NOT_VERIFIED' && (
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
                  {t('login.resend.sending', 'Wysyłanie...')}
                </>
              ) : (
                t('login.resend.button', 'Wyślij ponownie')
              )}
            </Button>
          </Box>
        )}
      </Alert>
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
          textAlign: 'center',
          '& .MuiAlert-message': {
            width: '100%',
            textAlign: 'center'
          }
        }}
        onClose={() => setResendSuccess(false)}
      >
        <strong>{t('login.resend.success.title', 'Email wysłany!')}</strong><br />
        {t('login.resend.success.message', 'Sprawdź swoją skrzynkę e-mail.')}
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
          textAlign: 'center',
          '& .MuiAlert-message': {
            width: '100%',
            textAlign: 'center'
          }
        }}
        onClose={() => setResendError(null)}
      >
        <strong>{t('login.resend.error.title', 'Błąd wysyłania')}</strong><br />
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
                sx={{width: '25vh'}} 
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
  if (!userDetails.username?.trim() || !userDetails.password?.trim()) {
    return {
      error: {
        code: 'INVALID_INPUT',
        message: 'Username and password are required',
        details: 'Please fill in all required fields'
      }
    };
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

      setTokens(accessToken, refreshToken, tokenType, res.roles)

    } catch (tokenError) {
      console.error('Token validation failed:', tokenError);
      return {
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token received',
          details: 'Please try logging in again'
        }
      };
    }

    return redirect(HomeViewUrl);

  } catch (err) {
    console.error("Login failed:", err);

    // Szczegółowa obsługa różnych typów błędów
    if (err.response?.status === 403) {
      const errorData = err.response.data;
      
      return {
        error: {
          code: errorData.code || 'FORBIDDEN',
          message: errorData.message || 'Access forbidden',
          details: errorData.details,
          timestamp: errorData.timestamp
        }
      };
    }

    if (err.response?.status === 401) {
      return {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password',
          details: 'Please check your credentials and try again'
        }
      };
    }

    if (err.response?.status >= 500) {
      return {
        error: {
          code: 'SERVER_ERROR',
          message: 'Server error occurred',
          details: 'Please try again later or contact support'
        }
      };
    }

    if (!err.response) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network connection failed',
          details: 'Please check your internet connection'
        }
      };
    }

    // Fallback dla nieznanych błędów
    return {
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        details: 'Please try again or contact support'
      }
    };
  }
}