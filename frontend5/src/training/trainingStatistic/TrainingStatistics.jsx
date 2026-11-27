import React, { useMemo, useState } from 'react';
import { useQueries, keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Analytics, ShowChart, SearchOff } from '@mui/icons-material';

import REST, { queryClient } from '../../utils/REST';
import ErrorAlert from '../../component/error/ErrorAlert';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import { fieldSx, HAIRLINE, surfaceSx } from '../../tokens';
import ExerciseChart from './ExerciseChart';
import { MAX_SERIES, assignSeriesColors } from './seriesColors';
import { TRAINING_TYPES } from '../component/TrainingTypeSelector';

// Backend expects dd-MM-yyyy path params (see StatisticController).
function formatApiDate(epoch) {
  return dayjs(epoch).format('DD-MM-YYYY');
}

// Default range start when "All" is selected – early enough to cover all data.
const ALL_TIME_BEGIN = dayjs('2015-01-01').valueOf();

const RANGE_PRESETS = [
  { key: '1M', months: 1 },
  { key: '3M', months: 3 },
  { key: '6M', months: 6 },
  { key: '12M', months: 12 },
  { key: 'all', months: null },
];

function Placeholder({ icon, children }) {
  return (
    <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
      {icon}
      <Typography>{children}</Typography>
    </Box>
  );
}

export default function TrainingStatistic() {
  const exerciseNames = useLoaderData() || [];
  const { t, i18n } = useTranslation();

  const dateFormat = i18n.language === 'pl' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';

  const [selectedExercises, setSelectedExercises] = useState(() =>
    exerciseNames.length > 0 ? [exerciseNames[0]] : []
  );
  // Kolor każdego ćwiczenia zostaje z nim, dopóki jest na wykresie (patrz assignSeriesColors).
  const [seriesColors, setSeriesColors] = useState(() => assignSeriesColors({}, selectedExercises));
  // Ile ćwiczeń z wczytanego szablonu nie zmieściło się na wykresie (limit MAX_SERIES).
  const [templateOverflow, setTemplateOverflow] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [chartType, setChartType] = useState('Capacity');
  const [beginDate, setBeginDate] = useState(ALL_TIME_BEGIN);
  const [endDate, setEndDate] = useState(dayjs().add(1, 'day').valueOf());
  const [activePreset, setActivePreset] = useState('all');

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
        const epoch = dayjs(point.localDate).valueOf();
        const row = byDate.get(epoch) || { localDate: epoch };
        row[name] = point.value;
        byDate.set(epoch, row);
      });
    });
    return Array.from(byDate.values()).sort((a, b) => a.localDate - b.localDate);
  }, [queryResults, selectedExercises]);

  const applyPreset = (preset) => {
    setEndDate(dayjs().add(1, 'day').valueOf());
    setBeginDate(
      preset.months ? dayjs().subtract(preset.months, 'month').valueOf() : ALL_TIME_BEGIN
    );
    setActivePreset(preset.key);
  };

  // Wykres pokazuje najwyżej MAX_SERIES ćwiczeń – kolory serii się nie powtarzają.
  const selectExercises = (names) => {
    const limited = names.slice(0, MAX_SERIES);
    setSelectedExercises(limited);
    setSeriesColors((previous) => assignSeriesColors(previous, limited));
    return names.length - limited.length;
  };

  // Manual edits to the exercise list detach it from the loaded template.
  const handleExercisesChange = (newValue) => {
    selectExercises(newValue);
    setSelectedTemplate(null);
    setTemplateOverflow(0);
  };

  // Load every exercise that belongs to the chosen training template into the chart.
  const handleTemplateChange = async (option) => {
    setSelectedTemplate(option);
    setTemplateOverflow(0);
    if (!option) return;

    setIsTemplateLoading(true);
    try {
      const template = await queryClient.fetchQuery({
        queryKey: ['training-template', option.value],
        queryFn: () => REST.getTrainingTemplate(option.value),
        staleTime: 1000 * 60 * 10,
      });
      setTemplateOverflow(selectExercises(template?.exercises ?? []));
    } finally {
      setIsTemplateLoading(false);
    }
  };

  const handleChangeBeginDate = (newValue) => {
    if (newValue && newValue.isValid()) {
      setBeginDate(newValue.valueOf());
      setActivePreset(null);
    }
  };

  const handleChangeEndDate = (newValue) => {
    if (newValue && newValue.isValid()) {
      setEndDate(newValue.valueOf());
      setActivePreset(null);
    }
  };

  const metricLabel = chartType === 'Weight' ? t('chart.weight') : t('chart.capacity');

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1400, mx: 'auto' }}>
      <FoodPageHeader
        icon={<Analytics />}
        title={t('chart.title')}
        description={t('chart.subtitle')}
        statLabel={t('chart.dataPointsLabel')}
        statValue={chartData.length}
        statLoading={isLoading}
        actions={
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(event, value) => value && setChartType(value)}
            size="small"
            aria-label={t('chart.chartType')}
            sx={{ '& .MuiToggleButton-root': { px: 2, textTransform: 'none' } }}
          >
            <ToggleButton value="Weight">{t('chart.weight')}</ToggleButton>
            <ToggleButton value="Capacity">{t('chart.capacity')}</ToggleButton>
          </ToggleButtonGroup>
        }
      >
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 240px' },
            gap: 1.5,
          }}
        >
          {/* Exercises (multi-select) */}
          <Autocomplete
            multiple
            disableCloseOnSelect
            size="small"
            id="exercise-name-autocomplete"
            value={selectedExercises}
            options={exerciseNames}
            getOptionDisabled={(option) =>
              selectedExercises.length >= MAX_SERIES && !selectedExercises.includes(option)
            }
            onChange={(event, newValue) => handleExercisesChange(newValue)}
            renderValue={(value, getItemProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getItemProps({ index });
                const color = seriesColors[option];
                return (
                  <Chip
                    key={key}
                    label={option}
                    size="small"
                    variant="outlined"
                    {...tagProps}
                    icon={
                      <Box
                        component="span"
                        sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }}
                      />
                    }
                    sx={{ borderColor: color, '& .MuiChip-icon': { ml: 1, mr: -0.25 } }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('chart.exercises')}
                placeholder={selectedExercises.length ? '' : t('chart.selectExercises')}
                helperText={
                  templateOverflow > 0
                    ? t('chart.templateTrimmed', {
                        count: MAX_SERIES,
                        total: selectedExercises.length + templateOverflow,
                      })
                    : selectedExercises.length >= MAX_SERIES
                      ? t('chart.maxSeries', { count: MAX_SERIES })
                      : undefined
                }
                sx={fieldSx}
              />
            )}
          />

          {/* Load all exercises from a training template */}
          <Autocomplete
            size="small"
            id="training-template-autocomplete"
            value={selectedTemplate}
            options={TRAINING_TYPES}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, val) => option.value === val.value}
            onChange={(event, option) => handleTemplateChange(option)}
            loading={isTemplateLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('chart.fromTemplate')}
                placeholder={t('chart.selectTemplate')}
                sx={fieldSx}
                slotProps={{
                  ...params.slotProps,
                  input: {
                    ...params.slotProps.input,
                    endAdornment: (
                      <>
                        {isTemplateLoading ? <CircularProgress size={18} /> : null}
                        {params.slotProps.input.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Date range */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1.5,
            mt: 0.5,
            width: '100%',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t('chart.beginDate')}
              value={dayjs(beginDate)}
              onChange={handleChangeBeginDate}
              format={dateFormat}
              slotProps={{ textField: { size: 'small', sx: { ...fieldSx, width: 170 } } }}
            />
            <DatePicker
              label={t('chart.endDate')}
              value={dayjs(endDate)}
              onChange={handleChangeEndDate}
              format={dateFormat}
              slotProps={{ textField: { size: 'small', sx: { ...fieldSx, width: 170 } } }}
            />
          </LocalizationProvider>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: { md: 'auto' } }}>
            {RANGE_PRESETS.map((preset) => {
              const active = preset.key === activePreset;
              return (
                <Chip
                  key={preset.key}
                  label={preset.months ? preset.key : t('chart.allTime')}
                  onClick={() => applyPreset(preset)}
                  clickable
                  color={active ? 'primary' : 'default'}
                  variant={active ? 'filled' : 'outlined'}
                  aria-pressed={active}
                  sx={{ fontWeight: active ? 600 : 400 }}
                />
              );
            })}
          </Box>
        </Box>
      </FoodPageHeader>

      {/* Chart */}
      <Box sx={surfaceSx}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
            px: 2.5,
            py: 1.5,
            borderBottom: HAIRLINE,
          }}
        >
          <Typography sx={{ fontWeight: 500 }}>{metricLabel}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            · {selectedExercises.length} {t('chart.exercises').toLowerCase()} · {chartData.length}{' '}
            {t('chart.dataPoints')}
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
          {exerciseNames.length === 0 ? (
            <Placeholder icon={<ShowChart sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />}>
              {t('training.noTrainings')}
            </Placeholder>
          ) : selectedExercises.length === 0 ? (
            <Placeholder icon={<ShowChart sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />}>
              {t('chart.noExercisesSelected')}
            </Placeholder>
          ) : isLoading && chartData.length === 0 ? (
            <Placeholder icon={<CircularProgress size={36} sx={{ mb: 2 }} />}>
              {t('chart.loadingChart')}
            </Placeholder>
          ) : errorResult ? (
            <ErrorAlert error={errorResult.error} />
          ) : chartData.length === 0 ? (
            <Placeholder icon={<SearchOff sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />}>
              {t('chart.noData')}
            </Placeholder>
          ) : (
            <ExerciseChart
              data={chartData}
              series={selectedExercises}
              colors={seriesColors}
              beginDate={beginDate}
              endDate={endDate}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export async function loader() {
  const exerciseNames = await REST.getExerciseNames();
  return exerciseNames.content.map((r) => r.name);
}
