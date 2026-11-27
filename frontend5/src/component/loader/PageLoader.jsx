import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// minHeight: domyślnie cały ekran; wewnątrz layoutu (pod nagłówkiem) mniej.
export default function PageLoader({ text, minHeight = '100dvh' }) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        minHeight,
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
          color: 'primary.main',
        }}
      />
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: '600' }}>
        {text || t('messages.loading')}
      </Typography>
    </Box>
  );
}
