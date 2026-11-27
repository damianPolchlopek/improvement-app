import Navigator from './Drawer';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Box, Button } from '@mui/material';

function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  let message = t('errorPage.notFound');
  if (isRouteErrorResponse(error)) {
    message =
      error.status === 404 ? t('errorPage.notFound') : `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  return (
    <>
      <Box component="nav" sx={{ width: { sm: 200 }, flexShrink: { sm: 0 } }}>
        <Navigator
          slotProps={{ paper: { style: { width: 200 } } }}
          sx={{ display: { sm: 'block', xs: 'none' } }}
        />
      </Box>
      {/* <Navigator  /> */}
      <Box component="main" sx={{ textAlign: 'center', '& pre': { textAlign: 'left' } }}>
        <h1>{t('errorPage.title')}</h1>
        <p>{message}</p>
        <Button component={Link} to="/app/" variant="contained" sx={{ mb: 3 }}>
          {t('errorPage.backHome')}
        </Button>
        {error instanceof Error && error.stack && (
          <pre style={{ whiteSpace: 'pre-wrap', color: 'crimson' }}>{error.stack}</pre>
        )}
      </Box>
    </>
  );
}

export default ErrorPage;
