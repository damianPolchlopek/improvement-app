import Navigator from './Drawer';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

import { Box } from '@mui/material';

function ErrorPage() {
  const error = useRouteError();
  // Tymczasowe logowanie diagnostyczne — pokazuje prawdziwą przyczynę błędu trasy
  console.error('Route error:', error);

  let message = 'Could not find this page!';
  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  return (
    <>
      <Box component="nav" sx={{ width: { sm: 200 }, flexShrink: { sm: 0 } }}>
        <Navigator
          PaperProps={{ style: { width: 200 } }}
          sx={{ display: { sm: 'block', xs: 'none' } }}
        />
      </Box>
      {/* <Navigator  /> */}
      <main>
        <h1>An error occurred!</h1>
        <p>{message}</p>
        {error instanceof Error && error.stack && (
          <pre style={{ whiteSpace: 'pre-wrap', color: 'crimson' }}>{error.stack}</pre>
        )}
      </main>
    </>
  );
}

export default ErrorPage;
