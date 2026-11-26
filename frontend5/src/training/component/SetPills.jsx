import { Box, Typography } from '@mui/material';
import { toSets } from './sets';

// Serie jako "pigułki": 5×50  5×50  5×55.
export default function SetPills({ reps, weight, size = 13 }) {
  const sets = toSets(reps, weight);
  if (!sets) {
    return (
      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
        {reps} · {weight}
      </Typography>
    );
  }
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {sets.map((set, index) => (
        <Box
          key={index}
          component="span"
          sx={{
            px: 0.75,
            borderRadius: 1,
            bgcolor: 'rgba(255,255,255,0.06)',
            fontSize: size,
            lineHeight: 1.8,
            whiteSpace: 'nowrap',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {set.reps}
          <Box component="span" sx={{ color: 'text.secondary', mx: 0.25 }}>
            ×
          </Box>
          {set.weight}
        </Box>
      ))}
    </Box>
  );
}
