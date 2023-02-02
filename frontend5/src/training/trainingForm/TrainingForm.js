import React, { useEffect, useState } from "react";
import REST from '../../utils/REST';
import SmallTable from "./SmallTable";
import BigTable from "./BigTable";

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import Typography from '@mui/material/Typography';


export default function TrainingForm(props) {
    const [exercises, setExercises] = useState([]);
    const [exerciseNames, setExerciseNames] = useState([]);
    const [exercisePlaces, setExercisePlaces] = useState([]);
    const [exerciseProgresses, setExerciseProgresses] = useState([]);
    const [exerciseTypes, setExerciseTypes] = useState([]);

    useEffect(() => {
      REST.getExerciseNames().then(response => {
        setExerciseNames(response.entity);
      });
  
      REST.getExercisePlaces().then(response => {
        setExercisePlaces(response.entity);
      });
  
      REST.getExerciseProgresses().then(response => {
        setExerciseProgresses(response.entity);
      });
  
      REST.getExerciseTypes().then(response => {
        setExerciseTypes(response.entity);
      });

    }, []);

    useEffect(() => {
      setExercises(props.exercises)
    });

    return(
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Typography 
          variant="h5" 
          component="div" 
        >
          Training Schema
        </Typography>
      </Grid>

      <SmallTable 
        hidden={!props.isSimpleForm}
        exercises={exercises}
        exerciseNames={exerciseNames}
        exerciseProgresses={exerciseProgresses}
      />

      <BigTable 
        hidden={props.isSimpleForm}
        exercises={exercises}
        exerciseNames={exerciseNames}
        exerciseProgresses={exerciseProgresses}
        exerciseTypes={exerciseTypes}
        exercisePlaces={exercisePlaces}
      />

      <Grid xs={12}>
        <Button onClick={() => props.submitFunction(exercises)}>Submit</Button>
      </Grid>
            
      </Grid>
    )
}