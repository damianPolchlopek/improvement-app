import { Box, Typography } from '@mui/material';

export default function InformationComponent({ children }) {
  return (
    <Box
      sx={{
        mt: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" color="text.secondary" align="center">
        {children}
      </Typography>
    </Box>
  );
}
