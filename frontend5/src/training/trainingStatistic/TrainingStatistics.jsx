import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';
import ExerciseChart from './ExerciseChart';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  FormControl,
  TextField,
} from '@mui/material';

import {
  DesktopDatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import moment from 'moment';
import Grid from '@mui/material/Unstable_Grid2';
import { useLoaderData } from 'react-router-dom';

function formatXAxis(tickItem) {
  return moment(tickItem).format('DD-MM-YYYY');
}

export default function TrainingStatistic() {
  const [exercises, setExercises] = useState([]);

  const exerciseNames = useLoaderData() || [];
  const [selectedExerciseName, setSelectedExerciseName] = useState('Bieżnia');

  const chartTypes = ['Weight', 'Capacity'];
  const [selectedChartType, setSelectedChartType] = useState('Capacity');

  const [beginDate, setBeginDate] = useState(1653145460000);
  const [endDate, setEndDate] = useState(moment().add(1, 'day').valueOf());

  const { t } = useTranslation();

  useEffect(() => {
    REST.getTrainingStatistic(selectedExerciseName, selectedChartType,
      formatXAxis(beginDate), formatXAxis(endDate)).then(response => {
      setExercises(response);
    });
  }, [beginDate, endDate, selectedChartType, selectedExerciseName]);

  const handleExerciseNameChange = (event, newValue) => {
    setSelectedExerciseName(newValue);
  };

  const handleChartTypeChange = (event, newValue) => {
    setSelectedChartType(newValue);
  };

  const handleChangeBeginDate = (newValue) => {
    setBeginDate(newValue.toDate());
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue.toDate());
  };

  return (
    <React.Fragment>
      <Grid 
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
      >
        {/* Row 1 */}
        <Grid container item xs={12} spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl variant="standard" sx={{ width: '100%' }}>
              {exerciseNames.length > 0 &&
                <Autocomplete
                  disableClearable
                  id="exercise-name-autocomplete"
                  value={selectedExerciseName}
                  options={exerciseNames}
                  onChange={handleExerciseNameChange}
                  renderInput={(params) => <TextField {...params} label={t('chart.exerciseName')} />}
                />}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <Autocomplete
                disableClearable
                id="chart-type-autocomplete"
                value={selectedChartType}
                options={chartTypes}
                onChange={handleChartTypeChange}
                renderInput={(params) => <TextField {...params} label={t('chart.chartType')} />}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Row 2 */}
        <Grid container item xs={12} spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label={t('chart.beginDate')}
                inputFormat="DD/MM/YYYY"
                value={beginDate}
                onChange={handleChangeBeginDate}
                renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label={t('chart.endDate')}
                inputFormat="DD/MM/YYYY"
                value={endDate}
                onChange={handleChangeEndDate}
                renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid container item xs={12} justifyContent="center" sx={{ marginTop: 3 }}>
        {exercises &&
          <ExerciseChart
            exercises={exercises}
            beginDate={beginDate}
            endDate={endDate}
          />}
      </Grid>
    </React.Fragment>
  );
}

export async function loader() {
  const exerciseNames = await REST.getExerciseNames();
  
  return exerciseNames.content
}