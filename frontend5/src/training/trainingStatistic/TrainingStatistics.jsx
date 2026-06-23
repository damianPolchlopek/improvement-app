import React, { useMemo, useState } from 'react';
import { useQueries, keepPreviousData } from '@tanstack/react-query';
import REST from '../../utils/REST';
import ExerciseChart, { CHART_COLORS } from './ExerciseChart';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
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

import { Analytics, TrendingUp } from '@mui/icons-material';

// Backend expects dd-MM-yyyy path params (see StatisticController).
function formatApiDate(epoch) {
  return moment(epoch).format('DD-MM-YYYY');
}

// Default range start when "All" is selected – early enough to cover all data.
const ALL_TIME_BEGIN = moment('2015-01-01').valueOf();

const RANGE_PRESETS = [
  { key: '1M', months: 1 },
  { key: '3M', months: 3 },
  { key: '6M', months: 6 },
  { key: '12M', months: 12 },
  { key: 'all', months: null },
];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
    '&:hover fieldset': { borderColor: '#4caf50' },
    '&.Mui-focused fieldset': { borderColor: '#4caf50' },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': { color: '#4caf50' },
  },
  '& .MuiIconButton-root': { color: 'white' },
  '& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator': { color: 'white' },
};

export default function TrainingStatistic() {
  const exerciseNames = useLoaderData() || [];
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const dateFormat = i18n.language === 'pl' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';

  const [selectedExercises, setSelectedExercises] = useState(() =>
    exerciseNames.length > 0 ? [exerciseNames[0]] : []
  );
  const [chartType, setChartType] = useState('Capacity');
  const [beginDate, setBeginDate] = useState(ALL_TIME_BEGIN);
  const [endDate, setEndDate] = useState(moment().add(1, 'day').valueOf());

  // One query per selected exercise; merged into a single series-per-exercise dataset.
  const queryResults = useQueries({
    queries: selectedExercises.map((name) => ({
      queryKey: ['training-statistic', name, chartType, beginDate, endDate],
      queryFn: () =>
        REST.getTrainingStatistic(
          name,
          chartType,
          formatApiDate(beginDate),
          formatApiDate(endDate)
        ),
      placeholderData: keepPreviousData,
      enabled: Boolean(name),
    })),
  });

  const isLoading = selectedExercises.length > 0 && queryResults.some((r) => r.isLoading);
  const errorResult = queryResults.find((r) => r.isError);

  const chartData = useMemo(() => {
    const byDate = new Map();
    queryResults.forEach((result, index) => {
      const name = selectedExercises[index];
      (result.data || []).forEach((point) => {
        const epoch = moment(point.localDate).valueOf();
        const row = byDate.get(epoch) || { localDate: epoch };
        row[name] = point.value;
        byDate.set(epoch, row);
      });
    });
    return Array.from(byDate.values()).sort((a, b) => a.localDate - b.localDate);
  }, [queryResults, selectedExercises]);

  const applyPreset = (preset) => {
    const end = moment().add(1, 'day');
    setEndDate(end.valueOf());
    setBeginDate(
      preset.months ? moment().subtract(preset.months, 'month').valueOf() : ALL_TIME_BEGIN
    );
  };

  const handleChangeBeginDate = (newValue) => {
    if (newValue && newValue.isValid()) setBeginDate(newValue.valueOf());
  };

  const handleChangeEndDate = (newValue) => {
    if (newValue && newValue.isValid()) setEndDate(newValue.valueOf());
  };

  if (exerciseNames.length === 0) {
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
    <Box sx={{ py: 3, minHeight: '100vh' }}>
      <Grid container spacing={2} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Compact controls toolbar */}
        <Grid size={12}>
          <Card
            elevation={6}
            sx={{
              borderRadius: 3,
              border: theme.palette.card.border,
              background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
              color: 'white',
              textAlign: 'left',
            }}
          >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                <Analytics sx={{ color: '#4caf50' }} />
                <Typography variant="h6" fontWeight={700} color="white">
                  {t('chart.title')}
                </Typography>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems="stretch">
                {/* Exercises (multi-select) */}
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  id="exercise-name-autocomplete"
                  value={selectedExercises}
                  options={exerciseNames}
                  onChange={(event, newValue) => setSelectedExercises(newValue)}
                  sx={{ flex: 1, minWidth: 240 }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          label={option}
                          size="small"
                          {...tagProps}
                          sx={{
                            backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                            color: '#0b1c25',
                            fontWeight: 700,
                            '& .MuiChip-deleteIcon': { color: 'rgba(0,0,0,0.5)' },
                          }}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('chart.exercises')}
                      placeholder={t('chart.selectExercises')}
                      variant="outlined"
                      sx={fieldSx}
                    />
                  )}
                />

                {/* Metric toggle */}
                <ToggleButtonGroup
                  value={chartType}
                  exclusive
                  onChange={(event, value) => value && setChartType(value)}
                  size="small"
                  sx={{
                    alignSelf: { xs: 'flex-start', md: 'center' },
                    '& .MuiToggleButton-root': {
                      color: 'rgba(255,255,255,0.7)',
                      borderColor: 'rgba(255,255,255,0.25)',
                      px: 2,
                    },
                    '& .Mui-selected': {
                      color: '#0b1c25 !important',
                      backgroundColor: '#4caf50 !important',
                      fontWeight: 700,
                    },
                  }}
                >
                  <ToggleButton value="Weight">{t('chart.weight')}</ToggleButton>
                  <ToggleButton value="Capacity">{t('chart.capacity')}</ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              {/* Date range row */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                gap={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                mt={2}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={t('chart.beginDate')}
                    value={dayjs(beginDate)}
                    onChange={handleChangeBeginDate}
                    format={dateFormat}
                    slotProps={{ textField: { size: 'small', sx: { ...fieldSx, minWidth: 160 } } }}
                  />
                  <DatePicker
                    label={t('chart.endDate')}
                    value={dayjs(endDate)}
                    onChange={handleChangeEndDate}
                    format={dateFormat}
                    slotProps={{ textField: { size: 'small', sx: { ...fieldSx, minWidth: 160 } } }}
                  />
                </LocalizationProvider>

                <Stack direction="row" gap={1} flexWrap="wrap">
                  {RANGE_PRESETS.map((preset) => (
                    <Chip
                      key={preset.key}
                      label={preset.months ? preset.key : t('chart.allTime')}
                      onClick={() => applyPreset(preset)}
                      variant="outlined"
                      size="small"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        '&:hover': {
                          borderColor: '#4caf50',
                          backgroundColor: 'rgba(76,175,80,0.12)',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid size={12}>
          <Card
            elevation={8}
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
              border: theme.palette.card.border,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                background: theme.palette.card.header,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TrendingUp />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6" fontWeight={600}>
                  {chartType === 'Weight' ? t('chart.weight') : t('chart.capacity')}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {selectedExercises.length > 0
                    ? `${selectedExercises.length} ${t('chart.exercises')} · ${chartData.length} ${t('chart.dataPoints')}`
                    : t('chart.subtitle')}
                </Typography>
              </Box>
            </Box>

            <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
              {selectedExercises.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  {t('chart.noExercisesSelected')}
                </Alert>
              ) : isLoading && chartData.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 8,
                  }}
                >
                  <CircularProgress size={48} sx={{ mb: 2, color: '#4caf50' }} />
                  <Typography variant="body1" color="white">
                    {t('chart.loadingChart')}
                  </Typography>
                </Box>
              ) : errorResult ? (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(211, 47, 47, 0.3)',
                    '& .MuiAlert-icon': { color: '#f44336' },
                  }}
                >
                  <ErrorAlert error={errorResult.error} />
                </Alert>
              ) : chartData.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  {t('chart.noData')}
                </Alert>
              ) : (
                <ExerciseChart
                  data={chartData}
                  series={selectedExercises}
                  beginDate={beginDate}
                  endDate={endDate}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export async function loader() {
  const exerciseNames = await REST.getExerciseNames();
  return exerciseNames.content.map((r) => r.name);
}
