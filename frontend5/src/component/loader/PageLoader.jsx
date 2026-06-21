import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function PageLoader({ text }) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          mb: 3,
          color: '#4caf50',
        }}
      />
      <Typography variant="h6" color="white" fontWeight="600">
        {text || t('messages.loading')}
      </Typography>
    </Box>
  );
}
