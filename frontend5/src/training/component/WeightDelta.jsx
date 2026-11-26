import { useTranslation } from 'react-i18next';
import { Box, Tooltip } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { formatSets, weightChange } from './sets';
import { localeOf } from '../trainingView/trainingWeeks';

// Zmiana średniego ciężaru serii względem poprzedniego wykonania ćwiczenia: ▲ 5 kg / ▼ 2,5 kg / =.
export default function WeightDelta({ current, previous }) {
  const { t, i18n } = useTranslation();
  const locale = localeOf(i18n.language);
  const diff = weightChange(current, previous);
  if (diff == null) return null;

  const Icon = diff > 0 ? ArrowDropUp : ArrowDropDown;
  const previousDate = previous.date ? new Date(previous.date).toLocaleDateString(locale) : '';
  const previousSets = formatSets(previous.reps, previous.weight);

  return (
    <Tooltip title={`${t('training.previousTime')} ${previousDate}: ${previousSets}`}>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: 13,
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
          color: diff > 0 ? '#5DCAA5' : diff < 0 ? '#F09595' : 'text.secondary',
        }}
      >
        {diff === 0 ? (
          '='
        ) : (
          <>
            <Icon fontSize="small" sx={{ ml: -0.5 }} aria-label={diff > 0 ? '▲' : '▼'} />
            {`${Math.abs(diff).toLocaleString(locale)} kg`}
          </>
        )}
      </Box>
    </Tooltip>
  );
}
