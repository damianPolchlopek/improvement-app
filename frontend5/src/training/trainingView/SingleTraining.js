import React, { useState } from 'react';
import REST from '../../utils/REST';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Button, Collapse } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Paper from '@mui/material/Paper';

export default function SingleTraining(props){
    const [exercises, setExercises] = useState([]);
    // const [isUpdated, setIsUpdated] = useState(false);

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);

        getExercisesByTrainingName(props.trainingName);
    };

    function getExercisesByTrainingName(trainingName) {
      trainingName = trainingName.replace(/ /g,"_");
    
      REST.getExercises(trainingName).then(response => {
        setExercises(response.entity);
      });
    }

    function getExercisesByDate(date){
      REST.getExercisesByDate(date).then(response => {
        setExercises(response.entity);
      });
    }
  
    function getExercisesByName(name){
      REST.getExercisesByName(name).then(response => {
        setExercises(response.entity);
      });
    }
    



    function updateTraining(trainingName) {
      console.log("Update training: ");
      console.log(trainingName);
  
      // setIsUpdated(!isUpdated);
      // setIsClicked(false);
  
      // setExercises([])
      // getExercisesByTrainingName(props.trainingName);
    }
  
    function deleteTraining(trainingName) {
      console.log("Delete training: ");
      console.log(trainingName);
    }

    return (
      <React.Fragment>
        <ListItem
          key={props.trainingName}
          disablePadding
          onClick={() => handleClick()}
        >
          <ListItemButton role={undefined} onClick={() => handleClick()} dense>
            <ListItemText id={props.trainingName} primary={props.trainingName} />
          </ListItemButton>

          <Button edge="end" onClick={() => updateTraining(props.trainingName)}>Modify</Button>
          <Button edge="end" onClick={() => deleteTraining(props.trainingName)}>Delete</Button>
        </ListItem>

        <Collapse in={open} timeout="auto" unmountOnExit >
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                    <TableCell align="right">Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Repetition</TableCell>
                    <TableCell align="right">Weight</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {exercises ? exercises.map((exercise) => (
                  <TableRow
                    key={exercise.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="right" onClick={() => {getExercisesByDate(exercise.date)}}>{exercise.date}</TableCell>
                    <TableCell onClick={() => {getExercisesByName(exercise.name)}}>{exercise.name}</TableCell>
                    <TableCell align="right">{exercise.reps}</TableCell>
                    <TableCell align="right">{exercise.weight}</TableCell>
                  </TableRow>
                )) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </React.Fragment>
    )
}