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

  const [exerciseNames, setExerciseNames] = useState([]);
  const [selectedExerciseName, setSelectedExerciseName] = useState('Bieżnia');

  const [selectedChartType, setSelectedChartType] = useState('Capacity');

  const [beginDate, setBeginDate] = React.useState(1633711100000);
  const [endDate, setEndDate] = React.useState(moment().add(1, 'day').valueOf());

  useEffect(() => {
    REST.getExerciseNames().then(response => {
      const exeNames = response.content.map(r => r.name)
      setExerciseNames(exeNames);
    });

  }, []);

  useEffect(() => {
    REST.getTrainingStatistic(selectedExerciseName, selectedChartType,
      formatXAxis(beginDate), formatXAxis(endDate)).then(response => {
      setExercises(response)
    });

  }, [beginDate, endDate, selectedChartType, selectedExerciseName]);


  const handleExerciseNameChange = (event, newValue) => {
    setSelectedExerciseName(newValue);
  };

  const handleChartTypeChange = (event) => {
    setSelectedChartType(event.target.value);
  };

  const handleChangeBeginDate = (newValue) => {
    setBeginDate(newValue.$d);
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue.$d);
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
            {exerciseNames.length > 0 ?
              <Autocomplete
                disableClearable
                id="combo-box-demo"
                defaultValue="Bieżnia"
                options={exerciseNames}
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

      {exercises &&
        <ExerciseChart
          exercises={exercises}
          beginDate={beginDate}
          endDate={endDate}
        />}

    </React.Fragment>
  );

}