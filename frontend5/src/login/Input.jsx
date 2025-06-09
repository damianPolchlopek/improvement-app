import {
  FormControl,
  TextField,
  Typography
} from '@mui/material';

export default function Input({ label, id, error, helperText, ...props }) {
    
  return (
    <FormControl sx={{ width: '100%' }}>
      <TextField
        {...props}
        label={label}
        id={id}
        name={id}
        placeholder={label}
        variant="outlined"
        fullWidth
        error={!!error}
        helperText={helperText}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: error ? 'error.main' : 'grey.300',
            },
          },
        }}
      />

      {error && (
        <Typography
          sx={{
            color: 'error.main', 
            margin: 0, 
            fontSize: '0.75rem', 
            lineHeight: 1.66,
            letterSpacing: '0.03333em',
            textAlign: 'left',
            marginTop: '3px',
            marginLeft: '14px',
            marginRight: '14px',
            minHeight: '1.5em'
          }}
        >
          {error}
        </Typography>
      )}
    </FormControl>
  );
}