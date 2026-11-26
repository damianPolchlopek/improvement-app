import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  Box,
  Button,
  ButtonBase,
  Collapse,
  Link,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  ArrowDropDown,
  ArrowDropUp,
  KeyboardArrowDown,
  TrendingFlat,
  TrendingUp,
} from '@mui/icons-material';

import REST from '../../utils/REST';
import ErrorAlert from '../../component/error/ErrorAlert';
import { localeOf, typeGroup, typeLabel } from './trainingWeeks';

const ROW_LINE = '1px solid rgba(255,255,255,0.06)';

// Wartości ExerciseProgress z backendu ("Zwiększyć" / "Zostawić").
const PROGRESS_STYLES = {
  Zwiększyć: {
    key: 'increase',
    icon: <TrendingUp sx={{ fontSize: 14 }} />,
    sx: { bgcolor: 'rgba(29, 158, 117, 0.18)', color: '#5DCAA5' },
  },
  Zostawić: {
    key: 'keep',
    icon: <TrendingFlat sx={{ fontSize: 14 }} />,
    sx: { bgcolor: 'rgba(255,255,255,0.06)', color: 'text.secondary' },
  },
};

function ProgressTag({ progress }) {
  const { t } = useTranslation();
  const style = PROGRESS_STYLES[progress];
  if (!progress) return null;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.125,
        borderRadius: 1.5,
        fontSize: 12,
        whiteSpace: 'nowrap',
        ...(style?.sx ?? { bgcolor: 'rgba(255,255,255,0.06)', color: 'text.secondary' }),
      }}
    >
      {style?.icon}
      {style ? t(`training.progress.${style.key}`) : progress}
    </Box>
  );
}

// "5/5/5" + "50/50/55" -> [{ reps: '5', weight: '50' }, ...]; null dla wartości z jednostkami
// (kardio: "5 km", "12 km/h") albo gdy liczba serii w powtórzeniach i ciężarze się różni.
function toSets(reps, weight) {
  const repsParts = String(reps ?? '')
    .split('/')
    .map((part) => part.trim());
  const weightParts = String(weight ?? '')
    .split('/')
    .map((part) => part.trim());
  const isNumber = (part) => part !== '' && Number.isFinite(Number(part));
  if (
    repsParts.length !== weightParts.length ||
    !repsParts.every(isNumber) ||
    !weightParts.every(isNumber)
  ) {
    return null;
  }
  return repsParts.map((r, i) => ({ reps: r, weight: weightParts[i] }));
}

// Serie jako "pigułki": 5×50  5×50  5×55.
function SetPills({ reps, weight }) {
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
            fontSize: 13,
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

// Średni ciężar ze wszystkich serii (zwykła średnia, bez ważenia powtórzeniami).
const averageWeight = (exercise) => {
  const sets = exercise && toSets(exercise.reps, exercise.weight);
  return sets ? sets.reduce((sum, set) => sum + Number(set.weight), 0) / sets.length : null;
};

// Zaokrąglenie do 0,1 kg – także po to, by błędy zmiennoprzecinkowe nie dawały fałszywych ▲/▼.
const roundKg = (value) => Math.round(value * 10) / 10;

// Zmiana średniego ciężaru serii względem poprzedniego wykonania ćwiczenia: ▲ 5 kg / ▼ 2,5 kg / =.
function WeightDelta({ current, previous }) {
  const { t, i18n } = useTranslation();
  const locale = localeOf(i18n.language);
  const now = averageWeight(current);
  const before = averageWeight(previous);
  if (now == null || before == null) return null;

  const diff = roundKg(now - before);
  const Icon = diff > 0 ? ArrowDropUp : ArrowDropDown;
  const previousDate = previous.date ? new Date(previous.date).toLocaleDateString(locale) : '';
  const previousSets = toSets(previous.reps, previous.weight)
    .map((set) => `${set.reps}×${set.weight}`)
    .join(', ');

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

// Dla ćwiczenia z treningu szuka jego poprzedniego wykonania w historii (wspólny cache
// dla wszystkich treningów) i pokazuje zmianę ciężaru.
function PreviousWeightDelta({ exercise }) {
  const { data } = useQuery({
    queryKey: ['exercise-history', exercise.name],
    queryFn: async () => (await REST.getExercisesByName(exercise.name)).content,
    enabled: !!exercise.name && averageWeight(exercise) != null,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const previous = (data ?? [])
    .filter((entry) => entry.id !== exercise.id && entry.date && entry.date < exercise.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  return <WeightDelta current={exercise} previous={previous} />;
}

// Tabela ćwiczeń: kolumny wyrównane między wierszami, treść wyśrodkowana w pionie.
const exerciseTableSx = {
  '& .MuiTableCell-root': {
    px: 1.5,
    py: 0.9,
    verticalAlign: 'middle',
    lineHeight: 1.5,
    borderBottom: ROW_LINE,
  },
  '& .MuiTableCell-root:first-of-type': { pl: 0 },
  '& .MuiTableCell-root:last-of-type': { pr: 0 },
  '& .MuiTableCell-head': {
    fontSize: 12,
    fontWeight: 500,
    color: 'text.secondary',
    whiteSpace: 'nowrap',
    py: 0.75,
  },
  '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root': { borderBottom: 0 },
};

// Jeden trening w tygodniu: etykieta dnia, typ, data i numer.
// Po rozwinięciu ćwiczenia z seriami i postępem; kliknięcie nazwy ćwiczenia pokazuje jego historię.
export default function SingleTraining({ training }) {
  const [isOpen, setIsOpen] = useState(false);
  const [historyOf, setHistoryOf] = useState(null);
  const { t, i18n } = useTranslation();
  const locale = localeOf(i18n.language);
  const group = typeGroup(training.type);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['exercises', training.name, historyOf ? { type: 'name', value: historyOf } : null],
    queryFn: async () => {
      const res = historyOf
        ? await REST.getExercisesByName(historyOf)
        : await REST.getExercises(training.name);
      return res.content;
    },
    enabled: isOpen,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const fullDate = training.date
    ? training.date.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';
  const weekdayShort = training.date
    ? training.date.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '')
    : '';
  const panelId = `training-${training.number ?? training.name}`;

  return (
    <Box>
      <ButtonBase
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pl: { xs: 2, md: 3 },
          pr: 2,
          py: 1,
          textAlign: 'left',
          bgcolor: isOpen ? 'rgba(144, 202, 249, 0.06)' : 'transparent',
          transition: 'background-color 150ms',
          '&:hover': { bgcolor: isOpen ? 'rgba(144, 202, 249, 0.08)' : 'rgba(255,255,255,0.03)' },
        }}
      >
        <Box
          component="span"
          sx={{
            width: 32,
            flexShrink: 0,
            textAlign: 'center',
            py: 0.25,
            borderRadius: 1.5,
            fontSize: 12,
            fontWeight: 500,
            bgcolor: group.bg,
            color: group.text,
          }}
        >
          {weekdayShort || '—'}
        </Box>
        <Typography
          variant="body2"
          sx={{
            width: 88,
            flexShrink: 0,
            color: 'text.secondary',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fullDate}
        </Typography>
        <Typography sx={{ flex: 1, minWidth: 0 }} noWrap>
          {typeLabel(training.type)}
        </Typography>
        {training.number && (
          <Typography variant="body2" sx={{ color: 'text.secondary', flexShrink: 0 }}>
            #{training.number}
          </Typography>
        )}
        <KeyboardArrowDown
          sx={{
            color: 'text.secondary',
            transition: 'transform 200ms',
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }}
        />
      </ButtonBase>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box id={panelId} sx={{ pl: { xs: 2, md: '68px' }, pr: { xs: 2, md: 5.5 }, pb: 1.5 }}>
          {historyOf && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
              <Button
                size="small"
                startIcon={<ArrowBack fontSize="small" />}
                onClick={() => setHistoryOf(null)}
                sx={{ color: 'text.secondary', ml: -1 }}
              >
                {t('training.backToTraining')}
              </Button>
              <Typography variant="body2" sx={{ fontWeight: 500, ml: 'auto' }} noWrap>
                {t('training.exerciseHistory', { name: historyOf })}
              </Typography>
            </Box>
          )}

          {isError ? (
            <ErrorAlert error={error} />
          ) : isLoading ? (
            [0, 1, 2].map((i) => <Skeleton key={i} height={36} />)
          ) : !data?.length ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', py: 1 }}>
              {t('training.noExercises')}
            </Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={exerciseTableSx}>
                <TableHead>
                  <TableRow>
                    <TableCell>{historyOf ? t('exercise.date') : t('exercise.name')}</TableCell>
                    <TableCell>{t('training.sets')}</TableCell>
                    <TableCell>{t('training.weightChange')}</TableCell>
                    <TableCell align="right">{t('exercise.progress')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((exercise, index) => (
                    <TableRow key={exercise.id ?? index}>
                      <TableCell sx={{ width: '45%' }}>
                        {historyOf ? (
                          exercise.date ? (
                            new Date(exercise.date).toLocaleDateString(locale)
                          ) : (
                            '—'
                          )
                        ) : (
                          <Link
                            component="button"
                            type="button"
                            underline="hover"
                            color="inherit"
                            title={t('training.showHistoryHint')}
                            onClick={() => setHistoryOf(exercise.name)}
                            sx={{
                              font: 'inherit',
                              verticalAlign: 'middle',
                              textAlign: 'left',
                            }}
                          >
                            {exercise.name}
                          </Link>
                        )}
                      </TableCell>
                      <TableCell>
                        <SetPills reps={exercise.reps} weight={exercise.weight} />
                      </TableCell>
                      <TableCell>
                        {historyOf ? (
                          // Historia jest posortowana od najnowszych – poprzednie wykonanie jest niżej.
                          <WeightDelta current={exercise} previous={data[index + 1]} />
                        ) : (
                          <PreviousWeightDelta exercise={exercise} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <ProgressTag progress={exercise.progress} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
