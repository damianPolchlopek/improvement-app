import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { History } from '@mui/icons-material';

import REST from '../../utils/REST';
import ErrorAlert from '../../component/error/ErrorAlert';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import { HAIRLINE, SURFACE, surfaceSx } from '../../tokens';
import TrainingTypeChips from '../component/TrainingTypeChips';
import SetPills from '../component/SetPills';
import WeightDelta from '../component/WeightDelta';
import { localeOf, typeLabel } from '../trainingView/trainingWeeks';
import { DATE_FORMAT } from '../component/dateFormat';

// Nieprzezroczyste tło (≈ tło karty na tle strony) – kolumna daty przykleja się przy przewijaniu.
const STICKY_BG = SURFACE.sticky;

// Odstępy i linie z motywu; tutaj tylko przyklejona kolumna daty.
const tableSx = {
  '& .MuiTableCell-root.sticky-col': {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    bgcolor: STICKY_BG,
    borderRight: HAIRLINE,
    minWidth: { xs: 96, sm: 120 },
  },
  // Węższe kolumny ćwiczeń na telefonie – więcej ćwiczeń widać bez przewijania.
  '& .MuiTableCell-root.exercise-col': { minWidth: { xs: 140, sm: 180 } },
};

// Historia treningów danego typu: wiersz = sesja, kolumna = ćwiczenie z szablonu.
export default function ExerciseView() {
  const [selectedTrainingType, setSelectedTrainingType] = useState('A');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { t, i18n } = useTranslation();
  const locale = localeOf(i18n.language);

  const {
    data: trainingData,
    isLoading: isTrainingLoading,
    isError: isTrainingError,
    error: trainingError,
  } = useQuery({
    queryKey: ['training-by-type', selectedTrainingType, page, size],
    queryFn: () => REST.getTrainingByType(selectedTrainingType, page, size),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: templateData,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
    error: templateError,
  } = useQuery({
    queryKey: ['training-template', selectedTrainingType],
    queryFn: () => REST.getTrainingTemplate(selectedTrainingType),
    staleTime: 1000 * 60 * 10,
  });

  const changeType = (type) => {
    setSelectedTrainingType(type);
    setPage(0);
  };

  const handleChangeSize = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  const isLoading = isTrainingLoading || isTemplateLoading;
  const isError = isTrainingError || isTemplateError;
  const rows = trainingData?.content ?? [];
  const exerciseNames = templateData?.exercises ?? [];

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1400, mx: 'auto' }}>
      <FoodPageHeader
        icon={<History />}
        title={t('training.history')}
        description={t('training.historyDesc')}
        statLabel={t('training.sessionsLabel')}
        statValue={trainingData?.totalElements ?? 0}
        statLoading={isTrainingLoading}
      >
        <TrainingTypeChips value={selectedTrainingType} onChange={changeType} />
      </FoodPageHeader>

      {isError ? (
        <ErrorAlert error={trainingError || templateError} />
      ) : (
        <Box sx={surfaceSx}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 1,
              px: 2,
              py: 1.5,
              borderBottom: HAIRLINE,
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>{typeLabel(selectedTrainingType)}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              · {t('training.exercisesInTemplate', { count: exerciseNames.length })}
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ px: 2, py: 1 }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} height={48} />
              ))}
            </Box>
          ) : rows.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <History sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
              <Typography>{t('training.noTrainingsToShow')}</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" sx={tableSx}>
                <TableHead>
                  <TableRow>
                    <TableCell className="sticky-col" sx={{ zIndex: 2 }}>
                      {t('training.date')}
                    </TableCell>
                    {exerciseNames.map((name) => (
                      <TableCell key={name} className="exercise-col">
                        {name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={row.date ?? rowIndex}>
                      <TableCell className="sticky-col">
                        <Typography
                          variant="body2"
                          sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}
                        >
                          {row.date
                            ? new Date(row.date).toLocaleDateString(locale, DATE_FORMAT)
                            : t('training.noData')}
                        </Typography>
                        {row.date && (
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {new Date(row.date).toLocaleDateString(locale, { weekday: 'long' })}
                          </Typography>
                        )}
                      </TableCell>
                      {exerciseNames.map((name) => {
                        const exercise = row.exercises?.[name];
                        if (!exercise) {
                          return (
                            <TableCell key={name} sx={{ color: 'text.disabled' }}>
                              —
                            </TableCell>
                          );
                        }
                        // Wiersze są od najnowszych, więc poprzednia sesja jest niżej.
                        const previous = rows[rowIndex + 1]?.exercises?.[name];
                        return (
                          <TableCell key={name}>
                            <SetPills reps={exercise.reps} weight={exercise.weight} />
                            <Box sx={{ minHeight: 20, mt: 0.25 }}>
                              <WeightDelta current={exercise} previous={previous} />
                            </Box>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!isLoading && rows.length > 0 && (
            <TablePagination
              component="div"
              size="small"
              rowsPerPageOptions={[5, 10, 25, 50]}
              count={trainingData.totalElements}
              rowsPerPage={size}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={handleChangeSize}
              sx={{ borderTop: HAIRLINE }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
