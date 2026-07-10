import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import DataTable from '../../component/table/DataTable';

import { Box, Card, CardContent, Toolbar, Typography, useTheme } from '@mui/material';

import Grid from '@mui/material/Grid';
import { FitnessCenter, TrendingUp, BarChart } from '@mui/icons-material';

import TrainingTypeSelector from '../component/TrainingTypeSelector';

export default function MaximumExerciseView() {
  const [trainingType, setTrainingType] = useState('A');
  const { t } = useTranslation();
  const theme = useTheme();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['ath-training', trainingType],
    queryFn: () => REST.getATHTraining(trainingType),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const maximumExerciseColumns = [
    {
      key: 'date',
      label: t('exercise.date'),
      accessor: 'date',
      render: (value) => (
        <Typography variant="body1" fontWeight="500">
          {value}
        </Typography>
      ),
    },
    {
      key: 'name',
      label: t('exercise.name'),
      accessor: 'name',
    },
    {
      key: 'reps',
      label: t('exercise.reps'),
      accessor: 'reps',
      align: 'right',
    },
    {
      key: 'weight',
      label: t('exercise.weight'),
      accessor: 'weight',
      align: 'right',
    },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Grid size={12}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              background: theme.palette.card.header,
              color: 'text.primary',
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <BarChart sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  {t('training.maxResults')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('training.maxResultsDesc')}
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
                value={trainingType}
                setTrainingType={setTrainingType}
                size="small"
                label={t('training.type')}
              />

              <Box display="flex" alignItems="center" gap={1}>
                <FitnessCenter fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {t('training.maxRecordsCount')}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {data?.content?.length || 0}
                </Typography>
              </Box>
            </Toolbar>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                background: theme.palette.card.header,
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TrendingUp sx={{ fontSize: 22 }} />
              <Typography variant="subtitle1" fontWeight="600">
                {t('training.bestResultsForType', { type: trainingType })}
              </Typography>
            </Box>

            <DataTable
              data={data?.content}
              isLoading={isLoading}
              isError={isError}
              error={error}
              columns={maximumExerciseColumns}
              loadingMessage={t('training.loadingMaxResults')}
              emptyMessage={t('training.noMaxRecords')}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
