import React, { useState } from 'react';
import REST from '../utils/REST';
import { useTranslation } from 'react-i18next';
import { Button, Alert, Box, CircularProgress, Link } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useInput } from './hooks/useInput';
import Input from './Input';
import AuthCard from './AuthCard';
import { HAIRLINE } from '../tokens';
import { redirect, Form, Link as RouterLink, useActionData, useNavigation } from 'react-router-dom';
import { setTokens } from './Authentication';
import { HomeViewUrl, SignUpUrl } from '../utils/URLHelper';
import {
  getErrorInfo,
  getResendMessages,
  handleLoginError,
  validateRequiredFields,
} from '../utils/errorSystem';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export default function LoginView() {
  const { t } = useTranslation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [errorVisible, setErrorVisible] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(null);
  const [prevActionError, setPrevActionError] = useState(actionData?.error);

  // Pobieranie komunikatów resend
  const resendMessages = getResendMessages(t);

  // Reset komunikatów, gdy pojawi się NOWY błąd akcji
  // (wzorzec React: adjust state during render zamiast useEffect + setState)
  if (actionData?.error !== prevActionError) {
    setPrevActionError(actionData?.error);
    if (actionData?.error) {
      setErrorVisible(true);
      setResendSuccess(false);
      setResendError(null);
    }
  }

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
      setResendError(error.response?.data?.message || resendMessages.error.failed);
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
        <Alert severity={errorInfo.severity} sx={{ mb: 2 }} onClose={() => setErrorVisible(false)}>
          <strong>{errorInfo.title}</strong>
          <br />
          {message || errorInfo.message}
          {details && (
            <>
              <br />
              <small>{details}</small>
            </>
          )}

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
      <Alert severity="success" sx={{ mb: 2 }} onClose={() => setResendSuccess(false)}>
        <strong>{resendMessages.success.title}</strong>
        <br />
        {resendMessages.success.message}
      </Alert>
    );
  };

  // Funkcja do renderowania błędu resend
  const renderResendError = () => {
    if (!resendError) return null;

    return (
      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setResendError(null)}>
        <strong>{resendMessages.error.title}</strong>
        <br />
        {resendError}
      </Alert>
    );
  };

  return (
    <AuthCard
      title={t('login.title')}
      description={t('login.description')}
      footer={
        <>
          {t('login.noAccount')}{' '}
          <Link component={RouterLink} to={SignUpUrl} underline="hover">
            {t('login.signUp')}
          </Link>
        </>
      }
    >
      {renderResendSuccess()}
      {renderResendError()}
      {renderError()}

      <Box component={Form} method="post" sx={{ display: 'grid', gap: 0.5 }}>
        <Input
          label={t('login.username')}
          id="username"
          name="username"
          autoComplete="username"
          autoFocus
          onBlur={handleUsernameBlur}
          onChange={handleUsernameChange}
          value={enteredUsername}
          error={usernameIsInvalid && t('login.validation.usernameRequired')}
          disabled={isSubmitting}
        />
        <Input
          label={t('login.password')}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          onBlur={handlePasswordBlur}
          onChange={handlePasswordChange}
          value={enteredPassword}
          error={passwordIsInvalid && t('login.validation.passwordRequired')}
          disabled={isSubmitting}
        />
        <Button
          variant="contained"
          size="large"
          type="submit"
          fullWidth
          disabled={isSubmitting || usernameIsInvalid || passwordIsInvalid}
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <LoginIcon />}
        >
          {isSubmitting ? t('login.submitting') : t('login.submit')}
        </Button>
      </Box>

      {/* Własny separator – globalny styl Divider w motywie dodaje tło */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          my: 2.5,
          color: 'text.secondary',
          fontSize: 12,
          '&::before, &::after': { content: '""', flex: 1, borderTop: HAIRLINE },
        }}
      >
        {t('login.or')}
      </Box>

      <Button
        variant="outlined"
        size="large"
        fullWidth
        startIcon={<GoogleIcon />}
        sx={{
          textTransform: 'none',
          color: 'text.primary',
          borderColor: 'line.strong',
          bgcolor: 'surface.field',
          '&:hover': { borderColor: 'rgba(255,255,255,0.32)', bgcolor: 'surface.subtle' },
        }}
        onClick={() =>
          (window.location.href = `${import.meta.env.VITE_API_URL}oauth2/authorization/google`)
        }
      >
        {t('login.loginWithGoogle')}
      </Button>
    </AuthCard>
  );
}

export async function action({ request }) {
  const data = await request.formData();

  const userDetails = {
    username: data.get('username'),
    password: data.get('password'),
  };

  // Walidacja po stronie serwera
  const validationError = validateRequiredFields(userDetails, ['username', 'password']);
  if (validationError) {
    return validationError;
  }

  try {
    const res = await REST.loginUser(userDetails);

    // Tokeny są ustawiane przez backend jako httpOnly cookies
    // W body dostajemy tylko dane użytkownika i czasy wygaśnięcia
    setTokens(res.accessTokenExpiresAt, res.refreshTokenExpiresAt, res.roles);

    return redirect(HomeViewUrl);
  } catch (err) {
    return handleLoginError(err);
  }
}
