import {
  FormControl,
  TextField,
  Typography
} from '@mui/material';

export default function Input({ label, id, error, ...props }) {
    
  return (
    <FormControl sx={{width: '30vh'}}>
      <TextField
        {...props}
        label={label}
        htmlFor={id}
        name={id}
        placeholder={id}
        variant="outlined"
      />

      <Typography
        sx={{
          color: 'red', 
          margin:0, 
          fontSize: '0.8rem', 
          height: '2rem',
          padding: '0.5rem 0'
        }}>
        {error}
      </Typography>
    </FormControl>
  );
}
  