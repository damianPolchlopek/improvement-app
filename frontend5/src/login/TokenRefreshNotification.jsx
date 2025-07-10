import { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { getTokenDuration } from '../login/Authentication.js';

export default function TokenRefreshNotification() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenDuration = getTokenDuration();
      const minutesLeft = Math.ceil(tokenDuration / (1000 * 60));
      console.log('Minutes left: ', minutesLeft)

      if (minutesLeft <= 2 && minutesLeft > 0) {
        setShowWarning(true);
        setTimeLeft(minutesLeft);
      } else {
        setShowWarning(true);
      }
    };
    
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60_000); // Sprawdzaj co minutę
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Snackbar
      open={showWarning}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="warning" onClose={() => setShowWarning(false)}>
        Twoja sesja wygaśnie za {timeLeft} minut.
      </Alert>
    </Snackbar>
  );
}