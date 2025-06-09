import { Paper } from "@mui/material";

export default function StyledPaper({ children, sx = {}, ...props }) {
  return (
    <Paper 
      elevation={18} 
      sx={{
        width: '100%',
        maxWidth: '500px',
        minHeight: 'auto',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: { xs: 2, sm: 3, md: 4 },
        margin: { xs: 1, sm: 2 },
        boxSizing: 'border-box',
        overflow: 'visible',
        // Dodanie responsywnych wymiarów
        '@media (max-width: 600px)': {
          maxWidth: 'calc(100vw - 32px)',
          margin: '16px',
        },
        // Łączenie z przekazanymi stylami
        ...sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}