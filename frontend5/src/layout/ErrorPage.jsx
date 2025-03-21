import Navigator from './Drawer'

import { Box } from '@mui/material';

function ErrorPage() {
  return (
    <>
      <Box
        component="nav"
        sx={{ width: { sm: 200 }, flexShrink: { sm: 0 } }}
      >        
      <Navigator PaperProps={{ style: { width: 200 } }}
          sx={{ display: { sm: 'block', xs: 'none' } }}/>
    </Box>
       {/* <Navigator  /> */}
      <main>
        <h1>An error occurred!</h1>
        <p>Could not find this page!</p>
      </main>
    </>
  );
}

export default ErrorPage;