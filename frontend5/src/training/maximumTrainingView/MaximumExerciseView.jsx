import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

import REST from '../../utils/REST';
import ErrorAlert from '../../component/error/ErrorAlert';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import { ACCENTS, surfaceSx } from '../../tokens';
import TrainingTypeChips from '../component/TrainingTypeChips';
import SetPills from '../component/SetPills';
import { toSets } from '../component/sets';
import { DATE_FORMAT, trainingTableSx } from '../component/trainingTableSx';
import { localeOf } from '../trainingView/trainingWeeks';

const RECORD_COLOR = ACCENTS.coral.light;

// Najlepsze wyniki w ćwiczeniach danego typu treningu – rekord po rekordzie.
export default function MaximumExerciseView() {
  const [trainingType, setTrainingType] = useState('A');
  const { t, i18n } = useTranslation();
  const locale = localeOf(i18n.language);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['ath-training', trainingType],
    queryFn: () => REST.getATHTraining(trainingType),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const records = data?.content ?? [];

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1100, mx: 'auto' }}>
      <FoodPageHeader
        icon={<EmojiEvents />}
        title={t('training.maxResults')}
        description={t('training.maxResultsDesc')}
        statLabel={t('training.recordsLabel')}
        statValue={records.length}
        statLoading={isLoading}
      >
        <TrainingTypeChips value={trainingType} onChange={setTrainingType} />
      </FoodPageHeader>

      {isError ? (
        <ErrorAlert error={error} />
      ) : (
        <Box sx={surfaceSx}>
          {isLoading ? (
            <Box sx={{ px: 2, py: 1 }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} height={44} />
              ))}
            </Box>
          ) : records.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <EmojiEvents sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
              <Typography>{t('training.noMaxRecords')}</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" sx={trainingTableSx}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 32 }}>#</TableCell>
                    <TableCell>{t('exercise.name')}</TableCell>
                    <TableCell>{t('exercise.date')}</TableCell>
                    <TableCell>{t('training.sets')}</TableCell>
                    <TableCell align="right">{t('training.heaviestSetLabel')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((exercise, index) => {
                    const sets = toSets(exercise.reps, exercise.weight);
                    const heaviest = sets
                      ? Math.max(...sets.map((set) => Number(set.weight)))
                      : null;
                    return (
                      <TableRow key={exercise.id ?? `${exercise.name}-${index}`}>
                        <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{exercise.name}</TableCell>
                        <TableCell
                          sx={{
                            color: 'text.secondary',
                            whiteSpace: 'nowrap',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {exercise.date
                            ? new Date(exercise.date).toLocaleDateString(locale, DATE_FORMAT)
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <SetPills reps={exercise.reps} weight={exercise.weight} />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}
                        >
                          {heaviest != null ? (
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: RECORD_COLOR,
                                fontWeight: 500,
                              }}
                            >
                              <EmojiEvents sx={{ fontSize: 16 }} />
                              {heaviest.toLocaleString(locale)} kg
                            </Box>
                          ) : (
                            <Box component="span" sx={{ color: 'text.secondary' }}>
                              {exercise.weight}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
}
