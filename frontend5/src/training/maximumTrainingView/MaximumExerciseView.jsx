import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import DataTable from '../../component/table/DataTable';

import {
  FormControl,
  Box,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { FitnessCenter, TrendingUp, BarChart } from '@mui/icons-material';

import TrainingTypeSelector from '../component/TrainingTypeSelector';

export default function MaximumExerciseView() {
  const [trainingType, setTrainingType] = useState('A');
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ath-training', trainingType],
    queryFn: () => REST.getATHTraining(trainingType),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
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
      )
    },
    {
      key: 'name',
      label: t('exercise.name'),
      accessor: 'name'
    },
    {
      key: 'reps',
      label: t('exercise.reps'),
      accessor: 'reps',
      align: 'right'
    },
    {
      key: 'weight',
      label: t('exercise.weight'),
      accessor: 'weight',
      align: 'right'
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>

        {/* Header Section */}
        <Grid xs={12}>
          <Card elevation={6} sx={{
            borderRadius: 3,
            background: theme.palette.card.header,
            color: 'white',
            mb: 2
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <BarChart sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  Maksymalne Wyniki
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Sprawdź swoje najlepsze osiągnięcia w ćwiczeniach
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Training Type Selector */}
        <Grid xs={12} md={4}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <FitnessCenter sx={{ color: '#4caf50', fontSize: 28 }} />
                <Typography variant="h6" fontWeight="600">
                  Typ Treningu
                </Typography>
              </Box>
              <FormControl fullWidth>
                <TrainingTypeSelector setTrainingType={setTrainingType} />
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Card */}
        <Grid xs={12} md={8}>
          <Card elevation={4} sx={{
            height: '100%',
            borderRadius: 3,
            background: 'linear-gradient(45deg, #ff9800, #f57c00)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3
          }}>
            <Box>
              <Typography variant="h3" fontWeight="700">
                {data?.content?.length || 0}
              </Typography>
              <Typography variant="body1">
                Liczba zapisanych rekordów maksymalnych
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid xs={12}>
          <Card elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{
              p: 3,
              background: theme.palette.card.header,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <TrendingUp sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight="600">
                Najlepsze Wyniki - Typ {trainingType}
              </Typography>
            </Box>

            <DataTable
              data={data?.content}
              isLoading={isLoading}
              isError={isError}
              error={error}
              columns={maximumExerciseColumns}
              loadingMessage="Ładowanie maksymalnych wyników..."
              emptyMessage="Brak rekordów maksymalnych"
            />
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}
