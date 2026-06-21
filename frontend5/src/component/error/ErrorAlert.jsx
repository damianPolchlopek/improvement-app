import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

export default function ErrorAlert({ error, severity = 'error' }) {
  const { t } = useTranslation();
  const isBackendError = error?.response?.data?.code && error?.response?.data?.message;

  if (!isBackendError) return null;

  const { code, message, timestamp, details } = error.response.data;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      minHeight="200px"
      marginTop={2}
    >
      <Alert
        severity={severity}
        style={{ maxWidth: 600, width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <AlertTitle>
          {t('common.error')}: {code}
        </AlertTitle>
        <div>{message}</div>
        <div style={{ fontSize: '0.8rem', marginTop: 4, color: '#666' }}>
          {t('common.occurred')}: {timestamp}
        </div>
        {details && (
          <div style={{ fontSize: '0.9rem', marginTop: 4 }}>
            {t('common.details')}: {details}
          </div>
        )}
      </Alert>
    </Box>
  );
}
