import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import ExerciseChart from './ExerciseChart';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  FormControl,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Box,
  Fade,
  Alert,
  useTheme,
} from '@mui/material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import moment from 'moment';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { useLoaderData } from 'react-router-dom';

import ErrorAlert from '../../component/error/ErrorAlert';
import InformationComponent from '../../component/InformationComponent';

import {
  Analytics,
  FitnessCenter,
  DateRange,
  TrendingUp,
  Assessment,
  QueryStats,
} from '@mui/icons-material';

function formatXAxis(tickItem) {
  return moment(tickItem).format('DD-MM-YYYY');
}

const dateFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#ff9800',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff9800',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#ff9800',
    },
  },
  '& .MuiIconButton-root': {
    color: 'white',
  },
};

export default function TrainingStatistic() {
  const exerciseNames = useLoaderData() || [];
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  // Format daty zależny od aktywnego języka (reaktywny na zmianę języka)
  const dateFormat = i18n.language === 'pl' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';

  const [selectedExerciseName, setSelectedExerciseName] = useState('Bieżnia');
  const [selectedChartType, setSelectedChartType] = useState('Capacity');
  const [beginDate, setBeginDate] = useState(1653145460000);
  const [endDate, setEndDate] = useState(moment().add(1, 'day').valueOf());

  // useQuery for exercises
  const {
    data: exercises,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['training-statistic', selectedExerciseName, selectedChartType, beginDate, endDate],
    queryFn: () =>
      REST.getTrainingStatistic(
        selectedExerciseName,
        selectedChartType,
        formatXAxis(beginDate),
        formatXAxis(endDate)
      ),
    keepPreviousData: true,
  });

  const handleExerciseNameChange = (event, newValue) => {
    setSelectedExerciseName(newValue);
  };

  const handleChartTypeChange = (event, newValue) => {
    setSelectedChartType(newValue);
  };

  const handleChangeBeginDate = (newValue) => {
    if (newValue && newValue.isValid()) {
      setBeginDate(newValue.valueOf());
    }
  };

  const handleChangeEndDate = (newValue) => {
    if (newValue && newValue.isValid()) {
      setEndDate(newValue.valueOf());
    }
  };

  if (exercises && exercises.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Grid size={12}>
            <InformationComponent>Trainings have not been added yet!</InformationComponent>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh' }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Grid size={12}>
          <Card
            elevation={8}
            sx={{
              borderRadius: 4,
              background: theme.palette.card.header,
              color: 'white',
              mb: 3,
              overflow: 'hidden',
              border: theme.palette.card.border,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Analytics sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                    Statystyki Treningu
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Analizuj swoje postępy i osiągnięcia
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={3} sx={{ mt: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <QueryStats sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Interaktywne wykresy
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Assessment sx={{ fontSize: 20 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Szczegółowe analizy
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Controls Section */}
        <Grid size={12}>
          <Card
            elevation={6}
            sx={{
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
              color: 'white',
            }}
          >
            <Box
              sx={{
                p: 2,
                background: theme.palette.card.header,
                borderBottom: theme.palette.card.border,
              }}
            >
              <Typography variant="h6" fontWeight="600" color="white">
                Parametry Wykresu
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Exercise Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 2,
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
                      color: 'white',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <FitnessCenter sx={{ color: '#4caf50', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="600" color="white">
                          Wybór Ćwiczenia
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={12}>
                          <FormControl fullWidth>
                            {exerciseNames.length > 0 && (
                              <Autocomplete
                                disableClearable
                                id="exercise-name-autocomplete"
                                value={selectedExerciseName}
                                options={exerciseNames}
                                onChange={handleExerciseNameChange}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={t('chart.exerciseName')}
                                    variant="outlined"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                        '& fieldset': {
                                          borderColor: 'rgba(255, 255, 255, 0.3)',
                                        },
                                        '&:hover fieldset': {
                                          borderColor: '#4caf50',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#4caf50',
                                        },
                                      },
                                      '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&.Mui-focused': {
                                          color: '#4caf50',
                                        },
                                      },
                                      '& .MuiAutocomplete-popupIndicator': {
                                        color: 'white',
                                      },
                                    }}
                                  />
                                )}
                              />
                            )}
                          </FormControl>
                        </Grid>
                        <Grid size={12}>
                          <FormControl fullWidth>
                            <Autocomplete
                              disableClearable
                              id="chart-type-autocomplete"
                              value={selectedChartType}
                              options={['Weight', 'Capacity']}
                              onChange={handleChartTypeChange}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={t('chart.chartType')}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                      color: 'white',
                                      '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                      },
                                      '&:hover fieldset': {
                                        borderColor: '#4caf50',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#4caf50',
                                      },
                                    },
                                    '& .MuiInputLabel-root': {
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      '&.Mui-focused': {
                                        color: '#4caf50',
                                      },
                                    },
                                    '& .MuiAutocomplete-popupIndicator': {
                                      color: 'white',
                                    },
                                  }}
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Date Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 2,
                      border: '1px solid rgba(255, 152, 0, 0.3)',
                      background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
                      color: 'white',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <DateRange sx={{ color: '#ff9800', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="600" color="white">
                          Zakres Dat
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={12}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={t('chart.beginDate')}
                              value={dayjs(beginDate)}
                              onChange={handleChangeBeginDate}
                              format={dateFormat}
                              slotProps={{
                                textField: { fullWidth: true, sx: dateFieldSx },
                              }}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid size={12}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={t('chart.endDate')}
                              value={dayjs(endDate)}
                              onChange={handleChangeEndDate}
                              format={dateFormat}
                              slotProps={{
                                textField: { fullWidth: true, sx: dateFieldSx },
                              }}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Section */}
        <Grid size={12}>
          <Fade in={true} timeout={1000}>
            <Card
              elevation={8}
              sx={{
                borderRadius: 4,
                background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: theme.palette.card.header,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <TrendingUp sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    Wykres Postępów
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {selectedExerciseName} - {selectedChartType}
                  </Typography>
                </Box>
              </Box>

              <CardContent sx={{ p: 4 }}>
                {isLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      py: 8,
                      background: 'linear-gradient(45deg, #1a2e3d 0%, #243441 100%)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <CircularProgress
                      size={60}
                      sx={{
                        mb: 3,
                        color: '#4caf50',
                      }}
                    />
                    <Typography variant="h6" color="white" fontWeight="600">
                      Ładowanie danych wykresu...
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 1 }}>
                      Przygotowywanie statystyk treningu
                    </Typography>
                  </Box>
                ) : isError ? (
                  <Alert
                    severity="error"
                    sx={{
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(211, 47, 47, 0.3)',
                      '& .MuiAlert-icon': {
                        color: '#f44336',
                      },
                    }}
                  >
                    <ErrorAlert error={error} />
                  </Alert>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    <ExerciseChart exercises={exercises} beginDate={beginDate} endDate={endDate} />
                  </Box>
                )}
              </CardContent>

              {/* Footer with current selection info */}
              {!isLoading && !isError && exercises && (
                <Box
                  sx={{
                    p: 3,
                    background: theme.palette.card.header,
                    borderTop: theme.palette.card.border,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight="700" color="white">
                          {selectedExerciseName}
                        </Typography>
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                          Wybrane ćwiczenie
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight="700" color="#4caf50">
                          {selectedChartType}
                        </Typography>
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                          Typ wykresu
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box textAlign="center">
                        <Typography variant="h6" fontWeight="700" color="#ff9800">
                          {exercises?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                          Punkty danych
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}

export async function loader() {
  const exerciseNames = await REST.getExerciseNames();
  return exerciseNames.content.map((r) => r.name);
}
