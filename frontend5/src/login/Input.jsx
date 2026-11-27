import { TextField } from '@mui/material';

// Pole formularza logowania / rejestracji: ciemniejsze tło jak w polach modułów,
// komunikat błędu (string) pod polem zamiast podpowiedzi.
export default function Input({ label, id, error, helperText, ...props }) {
  return (
    <TextField
      {...props}
      label={label}
      id={id}
      name={id}
      variant="outlined"
      fullWidth
      error={!!error}
      helperText={error || helperText || ' '}
      sx={{ '& .MuiInputBase-root': { bgcolor: 'surface.field' } }}
    />
  );
}
