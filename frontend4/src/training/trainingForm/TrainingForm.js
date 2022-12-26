import React, { useEffect, useState } from "react";
import REST from '../../utils/REST';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { ExpandLess, ExpandMore }from '@mui/icons-material';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function MyTableCell(props){
  return <TableCell style={{padding: '4px'}}>{props.children}</TableCell>
}

export default function TrainingForm(props) {
    var exercisess = [{name: 'aaa', reps: '1/1/1', place: 'Siłownia'}, 
                    {name: 'sss', place: 'Dom'}];
    const [exercises, setExercises] = useState(exercisess);
    const [exerciseNames, setExerciseNames] = useState(0);
    const [exercisePlaces, setExercisePlaces] = useState(0);
    const [exerciseProgresses, setExerciseProgresses] = useState(0);
    const [exerciseTypes, setExerciseTypes] = useState(0);

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

    }, [exercises]);

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

      <TableContainer padding="8px" >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <div hidden={props.isSimpleForm}>
                <MyTableCell hidden={props.isSimpleForm} >#</MyTableCell>
                <MyTableCell hidden={props.isSimpleForm}>Type</MyTableCell>
                <MyTableCell hidden={props.isSimpleForm}>Place</MyTableCell>
              </div>
                <MyTableCell>Name</MyTableCell>
                <MyTableCell>Reps</MyTableCell>
                <MyTableCell>Weight</MyTableCell>
                <MyTableCell>Progress</MyTableCell>
                <MyTableCell>Add</MyTableCell>
                <MyTableCell>Remove</MyTableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
          {exercises ? exercises.map((exercise, index) => (
            <TableRow style={{padding: '8px'}}>
              <div hidden={props.isSimpleForm}>
              <MyTableCell>{index}</MyTableCell>
              <MyTableCell>
                <Select 
                  name='type' 
                  defaultValue={exercise.type}
                  size='small'
                >
                  {exerciseTypes ? exerciseTypes.map(exerciseType => {
                    return(
                      <MenuItem key={exerciseType.type} value={exerciseType.type}>
                        {exerciseType.type}
                      </MenuItem>
                    );
                  }) : null}
                </Select>
              </MyTableCell>
              <MyTableCell>
                <Select 
                  name='place' 
                  defaultValue={exercise.place}
                  size='small'
                >
                  {exercisePlaces ? exercisePlaces.map(exercisePlace => {
                    return(
                      <MenuItem key={exercisePlace.place} value={exercisePlace.place}>
                        {exercisePlace.place}
                      </MenuItem>
                    );
                  }) : null}
                </Select>
              </MyTableCell>
              </div>
              <MyTableCell>
                <Select 
                  name='name' 
                  defaultValue={exercise.name}
                  size='small'
                >
                  {exerciseNames ? exerciseNames.map(exerciseName => {
                    return(
                      <MenuItem key={exerciseName.name} value={exerciseName.name}>
                        {exerciseName.name}
                      </MenuItem>
                    );
                  }) : null}
                </Select>
              </MyTableCell>
              <MyTableCell>
                <TextField
                  style={{width: 150}}
                  name='reps' 
                  placeholder="Reps..."
                  defaultValue={exercise.reps}
                  variant="outlined"
                  size="small"
                />
              </MyTableCell>
              <MyTableCell>
              <TextField
                  style={{width: 230}}
                  name='weight' 
                  placeholder="weight..."
                  defaultValue={exercise.weight}
                  variant="outlined"
                  size="small"
                />
              </MyTableCell>
              <MyTableCell>
                <Select 
                  name='progress' 
                  defaultValue={exercise.progress}
                  size='small'
                >
                  {exerciseProgresses ? exerciseProgresses.map(exerciseProgress => {
                    return(
                      <MenuItem key={exerciseProgress.progress} value={exerciseProgress.progress}>
                        {exerciseProgress.progress}
                      </MenuItem>
                    );
                  }) : null}
                </Select>
              </MyTableCell>
              <MyTableCell>
                <Button>Add</Button>
              </MyTableCell>
              <MyTableCell>
                <Button>Remove</Button>
              </MyTableCell>
            </TableRow>

          )): null}
              
          </TableBody>
        </Table>
      </TableContainer>

      <Grid xs={12}>
        <Button onClick={() => props.submitFunction(exercises)}>Submit</Button>
      </Grid>
            
      </Grid>
    )
}