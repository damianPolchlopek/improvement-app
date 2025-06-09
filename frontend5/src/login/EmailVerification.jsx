import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  Stack
} from '@mui/material';

import {
  CheckCircle,
  Error,
  Refresh,
  Home,
  Login
} from '@mui/icons-material';

import REST from '../utils/REST';

const EmailVerification = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Pobierz token z URL-a
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    
    if (!tokenParam) {
      setStatus('error');
      setMessage('Brak tokenu weryfikacyjnego w URL-u');
      return;
    }
    
    setToken(tokenParam);
    verifyEmail(tokenParam);
  }, []);

  const verifyEmail = async (token) => {
    try {
      setStatus('loading');
      
      const responseData = await REST.verifyEmail(token);
      
      if (responseData) {
        const result = responseData.message || 'Email został pomyślnie zweryfikowany!';
        setStatus('success');
        setMessage(result);
      } else {
        setStatus('error');
        setMessage('Nie otrzymano odpowiedzi z serwera');
      }
      
    } catch (error) {
      
      // Sprawdź czy to błąd axios z response
      if (error.response) {
        const errorMessage = error.response.data?.message || `Błąd serwera: ${error.response.status}`;
        setStatus('error');
        setMessage(errorMessage);
      } else if (error.request) {
        setStatus('error');
        setMessage('Brak odpowiedzi z serwera. Sprawdź połączenie internetowe.');
      } else {
        setStatus('error');
        setMessage(`Błąd: ${error.message || 'Nieznany błąd'}`);
      }
    }
  };

  const handleRetry = () => {
    if (token) {
      verifyEmail(token);
    }
  };

  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center">
              {status === 'loading' && (
                <Stack spacing={3} alignItems="center">
                  <CircularProgress size={64} color="primary" />
                  <Typography variant="h4" component="h1" gutterBottom>
                    Weryfikacja emaila...
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Proszę czekać, trwa weryfikacja Twojego adresu email.
                  </Typography>
                </Stack>
              )}
              
              {status === 'success' && (
                <Stack spacing={3} alignItems="center">
                  <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />
                  <Typography variant="h4" component="h1" color="success.main" gutterBottom>
                    Weryfikacja zakończona!
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
                    Przejdź do logowania
                  </Button>
                </Stack>
              )}
              
              {status === 'error' && (
                <Stack spacing={3} alignItems="center">
                  <Error sx={{ fontSize: 64, color: 'error.main' }} />
                  <Typography variant="h4" component="h1" color="error.main" gutterBottom>
                    Błąd weryfikacji
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
                      Spróbuj ponownie
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      startIcon={<Home />}
                      onClick={handleGoHome}
                      fullWidth
                    >
                      Wróć do strony głównej
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