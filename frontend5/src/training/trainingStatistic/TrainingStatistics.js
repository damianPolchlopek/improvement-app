import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from '@mui/material/Unstable_Grid2';

import ExerciseChart from './ExerciseChart';

import moment from 'moment';

function formatXAxis(tickItem) {
  return moment(tickItem).format('DD-MM-YYYY')
}

export default function TrainingStatistic() {
  const [exercises, setExercises] = useState();

  const [exerciseNames, setExerciseNames] = useState(0);
  const [selectedExerciseName, setSelectedExerciseName] = useState('Bieżnia');

  const [selectedChartType, setSelectedChartType] = useState('Capacity');

  const [beginDate, setBeginDate] = React.useState(1633711100000);
  const [endDate, setEndDate] = React.useState(moment().valueOf());

  useEffect(() => {
    REST.getTrainingStatistic(selectedExerciseName, selectedChartType, 
      formatXAxis(beginDate), formatXAxis(moment().valueOf())).then(response => {
        setExercises(response.entity)
    });

    REST.getExerciseNames().then(response => {
      setExerciseNames(response.entity);
    });

  }, []);


  const handleExerciseNameChange = (event) => {
    setSelectedExerciseName(event.target.value);

    REST.getTrainingStatistic(event.target.value, selectedChartType, 
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
          <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="demo-simple-select-standard-label">Exercise Name</InputLabel>
              {exerciseNames ? 
              <Select
                labelId="demo-simple-select-standard-label"
                value={selectedExerciseName}
                onChange={handleExerciseNameChange}
                label="Exercise Name"
              > 
              
                {exerciseNames.map((exerciseName, index) => 
                  <MenuItem key={index} value={exerciseName.name}>{exerciseName.name}</MenuItem>
                )}
              </Select>
            : null}
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
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