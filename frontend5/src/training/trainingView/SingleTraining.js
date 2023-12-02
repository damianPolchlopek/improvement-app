import React, {useState} from 'react';
import REST from '../../utils/REST';

import {
  Collapse,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

export default function SingleTraining(props) {
  const [exercises, setExercises] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);

    getExercisesByTrainingName(props.trainingName);
  };

  function getExercisesByTrainingName(trainingName) {
    trainingName = trainingName.replace(/ /g, "_");

    REST.getExercises(trainingName).then(response => {
      setExercises(response.content);
    });
  }

  function getExercisesByDate(date) {
    REST.getExercisesByDate(date).then(response => {
      setExercises(response.content);
    });
  }

  function getExercisesByName(name) {
    REST.getExercisesByName(name).then(response => {
      setExercises(response.content);
    });
  }

  return (
    <React.Fragment>
      <ListItem
        key={props.trainingName}
        disablePadding
        onClick={() => handleClick()}
      >
        <ListItemButton role={undefined} onClick={() => handleClick()} dense>
          <ListItemText id={props.trainingName} primary={props.trainingName}/>
        </ListItemButton>

      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
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
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell align="right" onClick={() => {
                    getExercisesByDate(exercise.date)
                  }}>{exercise.date}</TableCell>
                  <TableCell onClick={() => {
                    getExercisesByName(exercise.name)
                  }}>{exercise.name}</TableCell>
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