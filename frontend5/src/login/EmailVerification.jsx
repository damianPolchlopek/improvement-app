import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  Stack,
} from '@mui/material';

import { CheckCircle, Error, Refresh, Home, Login } from '@mui/icons-material';

import REST from '../utils/REST';
import { LoginUrl, HomeViewUrl } from '../utils/URLHelper';

const EmailVerification = () => {
  const { t } = useTranslation();
  // Token z URL czytany raz przy inicjalizacji (bez efektu / setState)
  const [token] = useState(() => new URLSearchParams(window.location.search).get('token') || '');
  const [status, setStatus] = useState(token ? 'loading' : 'error'); // loading, success, error
  // Komunikat jako { key, params } lub { text }, tłumaczony przy renderze — dzięki temu
  // `t` nie trafia do zależności efektu i zmiana języka nie wymusza ponownej weryfikacji.
  const [messageInfo, setMessageInfo] = useState(
    token ? null : { key: 'emailVerification.noToken' }
  );
  const navigate = useNavigate();

  // Licznik prób — bump w handleRetry ponownie uruchamia efekt weryfikacji
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!token) return;

    let active = true;

    (async () => {
      try {
        const responseData = await REST.verifyEmail(token);
        if (!active) return;

        if (responseData) {
          setStatus('success');
          setMessageInfo(
            responseData.message
              ? { text: responseData.message }
              : { key: 'emailVerification.success' }
          );
        } else {
          setStatus('error');
          setMessageInfo({ key: 'emailVerification.noResponse' });
        }
      } catch (error) {
        if (!active) return;

        // Sprawdź czy to błąd axios z response
        if (error.response) {
          setStatus('error');
          setMessageInfo(
            error.response.data?.message
              ? { text: error.response.data.message }
              : { key: 'emailVerification.serverError', params: { status: error.response.status } }
          );
        } else if (error.request) {
          setStatus('error');
          setMessageInfo({ key: 'emailVerification.noServerResponse' });
        } else {
          setStatus('error');
          setMessageInfo(
            error.message
              ? { key: 'emailVerification.genericError', params: { message: error.message } }
              : { key: 'emailVerification.unknownError' }
          );
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [token, attempt]);

  const handleRetry = () => {
    if (token) {
      setStatus('loading');
      setMessageInfo(null);
      setAttempt((prev) => prev + 1);
    }
  };

  const handleGoToLogin = () => {
    navigate(LoginUrl);
  };

  const handleGoHome = () => {
    navigate(HomeViewUrl);
  };

  // Tłumaczenie komunikatu przy renderze (reaguje na zmianę języka, bez ponownej weryfikacji)
  const message = messageInfo?.text ?? (messageInfo ? t(messageInfo.key, messageInfo.params) : '');

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center">
              {status === 'loading' && (
                <Stack spacing={3} alignItems="center">
                  <CircularProgress size={64} color="primary" />
                  <Typography variant="h4" component="h1" gutterBottom>
                    {t('emailVerification.loading')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('emailVerification.pleaseWait')}
                  </Typography>
                </Stack>
              )}

              {status === 'success' && (
                <Stack spacing={3} alignItems="center">
                  <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />
                  <Typography variant="h4" component="h1" color="success.main" gutterBottom>
                    {t('emailVerification.successTitle')}
                  </Typography>
                  <Alert severity="success" sx={{ width: '100%' }}>
                    {message}
                  </Alert>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<Login />}
                    onClick={handleGoToLogin}
                    fullWidth
                  >
                    {t('emailVerification.goToLogin')}
                  </Button>
                </Stack>
              )}

              {status === 'error' && (
                <Stack spacing={3} alignItems="center">
                  <Error sx={{ fontSize: 64, color: 'error.main' }} />
                  <Typography variant="h4" component="h1" color="error.main" gutterBottom>
                    {t('emailVerification.errorTitle')}
                  </Typography>
                  <Alert severity="error" sx={{ width: '100%' }}>
                    {message}
                  </Alert>
                  <Stack spacing={2} sx={{ width: '100%' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<Refresh />}
                      onClick={handleRetry}
                      fullWidth
                    >
                      {t('emailVerification.retry')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      startIcon={<Home />}
                      onClick={handleGoHome}
                      fullWidth
                    >
                      {t('emailVerification.goHome')}
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default EmailVerification;
