import { Box, Typography } from "@mui/material";

export default function InformationComponent({ children }) {
  return (
    <Box 
        sx={{ 
            mt: 4, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '200px',
            background: 'grey',
        }}
    >
        <Typography 
            variant="h6" 
            color="text.secondary" 
            align="center"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
            {children}
        </Typography>
    </Box>
  );
}