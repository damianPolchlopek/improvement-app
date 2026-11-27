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
  Typography,
} from '@mui/material';
import { ArrowBack, KeyboardArrowDown, TrendingFlat, TrendingUp } from '@mui/icons-material';

import REST from '../../utils/REST';
import ErrorAlert from '../../component/error/ErrorAlert';
import { localeOf, typeGroup, typeLabel } from './trainingWeeks';
import { averageWeight } from '../component/sets';
import SetPills from '../component/SetPills';
import WeightDelta from '../component/WeightDelta';

// Wartości ExerciseProgress z backendu ("Zwiększyć" / "Zostawić").
const PROGRESS_STYLES = {
  Zwiększyć: {
    key: 'increase',
    icon: <TrendingUp sx={{ fontSize: 14 }} />,
    sx: { bgcolor: 'status.doneBg', color: 'status.done' },
  },
  Zostawić: {
    key: 'keep',
    icon: <TrendingFlat sx={{ fontSize: 14 }} />,
    sx: { bgcolor: 'surface.chip', color: 'text.secondary' },
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
        ...(style?.sx ?? { bgcolor: 'surface.chip', color: 'text.secondary' }),
      }}
    >
      {style?.icon}
      {style ? t(`training.progress.${style.key}`) : progress}
    </Box>
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

// Tabela ćwiczeń: gęstsza niż domyślna z motywu i wyrównana do krawędzi rozwiniętego wiersza.
const exerciseTableSx = {
  '& .MuiTableCell-root': { px: 1.5, py: 0.9, lineHeight: 1.5 },
  '& .MuiTableCell-root:first-of-type': { pl: 0 },
  '& .MuiTableCell-root:last-of-type': { pr: 0 },
  '& .MuiTableCell-head': { py: 0.75 },
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
          bgcolor: isOpen ? 'primaryTint.subtle' : 'transparent',
          transition: 'background-color 150ms',
          '&:hover': { bgcolor: isOpen ? 'primaryTint.selected' : 'surface.hoverStrong' },
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
