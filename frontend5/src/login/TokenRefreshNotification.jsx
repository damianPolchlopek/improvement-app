import { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getTokenDuration } from '../login/Authentication.js';

export default function TokenRefreshNotification() {
  const { t } = useTranslation();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenDuration = getTokenDuration();
      const minutesLeft = Math.ceil(tokenDuration / (1000 * 60));

      if (minutesLeft <= 2 && minutesLeft > 0) {
        setShowWarning(true);
        setTimeLeft(minutesLeft);
      } else {
        setShowWarning(false);
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60_000); // Sprawdzaj co minutę

    return () => clearInterval(interval);
  }, []);

  return (
    <Snackbar open={showWarning} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="warning" onClose={() => setShowWarning(false)}>
        {t('login.sessionExpiring', { minutes: timeLeft })}
      </Alert>
    </Snackbar>
  );
}
