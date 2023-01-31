import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import ExerciseChart from './ExerciseChart';

export default function TrainingStatistic() {
  const [exercises, setExercises] = useState();

  const [exerciseNames, setExerciseNames] = useState(0);
  const [selectedExerciseName, setSelectedExerciseName] = useState('Bieżnia');

  const [selectedChartType, setSelectedChartType] = useState('Weight');


  useEffect(() => {
    REST.getTestStatistic(selectedExerciseName).then(response => {
      setExercises(response.entity);
    });

    REST.getExerciseNames().then(response => {
      setExerciseNames(response.entity);
    });

  }, []);
  
  const handleExerciseNameChange = (event) => {
    setSelectedExerciseName(event.target.value);

    REST.getTestStatistic(event.target.value).then(response => {
      setExercises(response.entity);
    });

    // filterMeals(mealCategory, event.target.value);
  };

  const handleChartTypeChange = (event) => {
    console.log(event.target.value);
    setSelectedChartType(event.target.value);


    REST.getWeightStatistic(selectedExerciseName).then(response => {
      setExercises(response.entity);
    });


    // filterMeals(mealCategory, event.target.value);
  };

  const filterExerciseByTypeAndName = (event) => {

  };

  return (
    <React.Fragment>

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

      {exercises ? <ExerciseChart exercises={exercises}/> : null}
      
    </React.Fragment>
  );
  
}