import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import TrainingTypeSelector from '../component/TrainingTypeSelector';
import InformationComponent from '../../component/InformationComponent';
import DataTable from '../../component/table/DataTable';

import {
  Box,
  TablePagination,
  Card,
  CardContent,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';

import Grid from '@mui/material/Grid';
import { FitnessCenter, ViewList, TrendingUp } from '@mui/icons-material';

export default function ExerciseView() {
  const [selectedTrainingType, setSelectedTrainingType] = useState('A');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { t } = useTranslation();
  const theme = useTheme();

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

  const handleChangeSize = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isLoading = isTrainingLoading || isTemplateLoading;
  const isError = isTrainingError || isTemplateError;

  if (trainingData && trainingData.content && trainingData.content.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Grid size={12}>
            <InformationComponent>{t('training.noTrainings')}</InformationComponent>
          </Grid>
        </Grid>
      </Box>
    );
  }

  const createTrainingColumns = () => {
    if (!templateData?.exercises) return [];

    const columns = [
      {
        key: 'date',
        label: t('training.date'),
        accessor: 'date',
        render: (value) => (
          <Typography variant="body1" fontWeight="500">
            {value || t('training.noData')}
          </Typography>
        ),
      },
    ];

    // Dodaj kolumny dla każdego ćwiczenia
    templateData.exercises.forEach((exerciseName) => {
      columns.push({
        key: exerciseName,
        label: exerciseName,
        accessor: (row) => row.exercises?.[exerciseName] || {},
        render: (exerciseData) => (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" color="text.primary">
              <strong>{t('exercise.weight')}:</strong> {exerciseData.weight || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.primary">
              <strong>{t('exercise.reps')}:</strong> {exerciseData.reps || 'N/A'}
            </Typography>
          </Box>
        ),
      });
    });

    return columns;
  };

  const trainingColumns = createTrainingColumns();

  return (
    <Box
      sx={{
        py: 4,
      }}
    >
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Grid size={12}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              background: theme.palette.card.header,
              color: 'white',
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TrendingUp sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  {t('training.history')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('training.historyDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters + stats */}
        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <Toolbar
              sx={{
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: 3,
                rowGap: 1.5,
                py: 1.5,
                minHeight: 'auto',
              }}
            >
              <TrainingTypeSelector
                value={selectedTrainingType}
                setTrainingType={setSelectedTrainingType}
                size="small"
                label={t('training.type')}
              />

              <Box display="flex" alignItems="center" gap={1}>
                <FitnessCenter fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {t('training.totalTrainings')}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {trainingData?.totalElements || 0}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <ViewList fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {t('training.exerciseCount')}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {templateData?.exercises?.length || 0}
                </Typography>
              </Box>
            </Toolbar>
          </Card>
        </Grid>

        {/* Main Table */}
        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                background: theme.palette.card.header,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <ViewList sx={{ fontSize: 22 }} />
              <Typography variant="subtitle1" fontWeight="600">
                {t('training.historyForType', { type: selectedTrainingType })}
              </Typography>
            </Box>

            <DataTable
              data={trainingData?.content}
              isLoading={isLoading}
              isError={isError}
              error={trainingError || templateError}
              columns={trainingColumns}
              loadingMessage={t('training.loadingHistory')}
              emptyMessage={t('training.noTrainingsToShow')}
            />

            {/* Paginacja */}
            {trainingData && (
              <TablePagination
                size="small"
                rowsPerPageOptions={[5, 10, 25, 50]}
                count={trainingData.totalElements}
                rowsPerPage={size}
                component="div"
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeSize}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
