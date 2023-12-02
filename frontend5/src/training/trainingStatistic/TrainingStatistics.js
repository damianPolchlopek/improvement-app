import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';
import ExerciseChart from './ExerciseChart';

import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import {
  DesktopDatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import moment from 'moment';
import Grid from '@mui/material/Unstable_Grid2';


function formatXAxis(tickItem) {
  return moment(tickItem).format('DD-MM-YYYY')
}

export default function TrainingStatistic() {
  const [exercises, setExercises] = useState();

  const [exerciseNames, setExerciseNames] = useState('Bieżnia');
  const [selectedExerciseName, setSelectedExerciseName] = useState('Bieżnia');

  const [selectedChartType, setSelectedChartType] = useState('Capacity');

  const [beginDate, setBeginDate] = React.useState(1633711100000);
  const [endDate, setEndDate] = React.useState(moment().add(1, 'day').valueOf());

  useEffect(() => {
    REST.getTrainingStatistic(selectedExerciseName, selectedChartType,
      formatXAxis(beginDate), formatXAxis(endDate)).then(response => {
      setExercises(response)
    });

    REST.getExerciseNames().then(response => {
      console.log('Exe names: ')
      console.log(response.content)
      const exeNames = response.content.map(r => r.name)
      console.log(exeNames)

      setExerciseNames(exeNames);
    });

  }, [beginDate, endDate, selectedChartType, selectedExerciseName]);


  const handleExerciseNameChange = (event, newValue) => {
    setSelectedExerciseName(newValue);

    REST.getTrainingStatistic(newValue, selectedChartType,
      formatXAxis(beginDate), formatXAxis(endDate)).then(response => {
      setExercises(response.entity)
    });
  };

  const handleChartTypeChange = (event) => {
    setSelectedChartType(event.target.value);

    REST.getTrainingStatistic(selectedExerciseName, event.target.value,
      formatXAxis(beginDate), formatXAxis(endDate)).then(response => {
      setExercises(response.entity)
    });
  };

  const handleChangeBeginDate = (newValue) => {
    setBeginDate(newValue.$d);

    REST.getTrainingStatistic(selectedExerciseName, selectedChartType,
      formatXAxis(newValue.$d), formatXAxis(endDate)).then(response => {
      setExercises(response.entity)
    });
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue.$d);

    REST.getTrainingStatistic(selectedExerciseName, selectedChartType,
      formatXAxis(beginDate), formatXAxis(newValue.$d)).then(response => {
      setExercises(response.entity)
    });
  };

  return (
    <React.Fragment>
      <Grid container centered
            rowSpacing={3}
            columnSpacing={3}
            direction="row"
            alignItems="center"
            justifyContent="center"
      >
        <Grid xs={12}>
          <FormControl variant="standard" sx={{m: 1, minWidth: 150}}>
            {Array.isArray(exerciseNames) ?
              <Autocomplete
                disableClearable
                id="combo-box-demo"
                defaultValue="Bieżnia"
                options={exerciseNames}
                // value={selectedExerciseName}
                // value="Bieżnia"
                onChange={handleExerciseNameChange}
                renderInput={(params) => <TextField {...params} label="Exercise Name"/>}
              />
              : null}
          </FormControl>

          <FormControl variant="standard" sx={{m: 1, minWidth: 150}}>
            <InputLabel id="demo-simple-select-standard-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              value={selectedChartType}
              onChange={handleChartTypeChange}
              label="Exercise Name"
            >
              <MenuItem value="Weight">Weight</MenuItem>
              <MenuItem value="Capacity">Capacity</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Begin date"
              inputFormat="DD/MM/YYYY"
              value={beginDate}
              onChange={handleChangeBeginDate}
              renderInput={(params) => <TextField {...params} />}
            />

            <DesktopDatePicker
              label="End Date"
              inputFormat="DD/MM/YYYY"
              value={endDate}
              onChange={handleChangeEndDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {exercises ?
        <ExerciseChart
          exercises={exercises}
          beginDate={beginDate}
          endDate={endDate}
        />
        : null}

    </React.Fragment>
  );

}