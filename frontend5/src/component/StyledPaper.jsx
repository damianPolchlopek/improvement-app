import { Paper } from "@mui/material";

export default function StyledPaper({ children }) {
    
    return (
      <Paper elevation={18} sx={{
          width: '70vh',
          height: '70vh',
          textAlign: 'center',
          display: 'flex',
          alignItems: "center",
          flexDirection: 'column', 
          justifyContent: 'center'
        }}>
        {children}
      </Paper>
    );
}