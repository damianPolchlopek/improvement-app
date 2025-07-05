import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  FormControl,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Fade,
  useTheme
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { FitnessCenter, TrendingUp, BarChart } from '@mui/icons-material';

import StyledTableRow from '../../component/table/StyledTableRow';
import StyledTableCell from '../../component/table/StyledTableCell';
import TrainingTypeSelector from '../component/TrainingTypeSelector';
import ErrorAlert from '../../component/error/ErrorAlert';
import InformationComponent from '../../component/InformationComponent';

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

  if (data && data.content && data.content.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Grid xs={12}>
            <InformationComponent>Trainings have not been added yet!</InformationComponent>
          </Grid>
        </Grid>
      </Box>
    );
  }

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

        {/* Loading State */}
        {isLoading && (
          <Grid xs={12}>
            <Card elevation={6}>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Ładowanie danych...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Error State */}
        {isError && (
          <Grid xs={12}>
            <Fade in={true}>
              <Alert severity="error" sx={{ borderRadius: 2, fontSize: '1.1rem' }}>
                <ErrorAlert error={error} />
              </Alert>
            </Fade>
          </Grid>
        )}

        {/* Data Table */}
        {!isLoading && !isError && data && (
          <Grid xs={12}>
            <Card elevation={8} sx={{
              borderRadius: 4,
              overflow: 'hidden'
            }}>
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

              <TableContainer>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>
                        <Typography variant="subtitle1" fontWeight="600">
                          {t('exercise.date')}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="subtitle1" fontWeight="600">
                          {t('exercise.name')}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography variant="subtitle1" fontWeight="600">
                          {t('exercise.reps')}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Typography variant="subtitle1" fontWeight="600">
                          {t('exercise.weight')}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {data.content.map((exercise) => (
                      <StyledTableRow key={exercise.id}>
                        <StyledTableCell>
                          <Typography variant="body1" fontWeight="500">
                            {exercise.date}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography variant="body1">
                            {exercise.name}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Typography variant="body1">
                            {exercise.reps}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Typography variant="body1">
                            {exercise.weight}
                          </Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        )}

      </Grid>
    </Box>
  );
}
