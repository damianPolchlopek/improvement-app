import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

function fallbackMessage(error, t) {
  if (!error?.response) return t('common.networkError'); // brak sieci / timeout
  const { status } = error.response;
  if (status === 401 || status === 403) return t('common.sessionExpired');
  return t('common.unexpectedError', { status });
}

export default function ErrorAlert({ error, severity = 'error' }) {
  const { t } = useTranslation();
  if (!error) return null;

  const isBackendError = error?.response?.data?.code && error?.response?.data?.message;

  // Błąd spoza formatu backendu (sieć, timeout, wygasła sesja, proxy...) —
  // zwięzły komunikat zamiast cichego `null`.
  if (!isBackendError) {
    return (
      <Alert severity={severity} sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
        {fallbackMessage(error, t)}
      </Alert>
    );
  }

  const { code, message, timestamp, details } = error.response.data;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '200px',
        marginTop: 2,
      }}
    >
      <Alert
        severity={severity}
        style={{ maxWidth: 600, width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <AlertTitle>
          {t('common.error')}: {code}
        </AlertTitle>
        <div>{message}</div>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
          {t('common.occurred')}: {timestamp}
        </Typography>
        {details && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {t('common.details')}: {details}
          </Typography>
        )}
      </Alert>
    </Box>
  );
}
