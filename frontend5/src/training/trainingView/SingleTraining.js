import React, { useState } from 'react';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

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
  const [open, setOpen] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const { t } = useTranslation();

  const handleClick = () => {
    setOpen(!open);
    if (!dataFetched) {
      getExercisesByTrainingName(props.trainingName);
      setDataFetched(true);
    }
  };


  function getExercisesByTrainingName(trainingName) {
    const modifiedTrainingName = trainingName.replace(/ /g, "_");

    REST.getExercises(modifiedTrainingName).then(response => {
      setExercises(response.content);
    }).catch(error => {
      console.error('Error fetching exercises:', error);
    });
  }

  function getExercisesByDate(date) {
    REST.getExercisesByDate(date).then(response => {
      setExercises(response.content);
    }).catch(error => {
      console.error("Error fetching exercises by date:", error);
    });
  }
  
  function getExercisesByName(name) {
    REST.getExercisesByName(name).then(response => {
      setExercises(response.content);
    }).catch(error => {
      console.error('Error fetching exercises by name:', error);
    });
  }

  return (
    <React.Fragment>
      <ListItem
        key={props.trainingName}
        disablePadding
        onClick={() => handleClick()}
      >
        <ListItemButton role={undefined} dense>
          <ListItemText id={props.trainingName} primary={props.trainingName}/>
        </ListItemButton>

      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">{t('exercise.date')}</TableCell>
                <TableCell>{t('exercise.name')}</TableCell>
                <TableCell align="right">{t('exercise.reps')}</TableCell>
                <TableCell align="right">{t('exercise.weight')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {exercises.map((exercise) => (
                <TableRow
                  key={exercise.id}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell 
                    align="right" 
                    key={exercise.name}
                    onClick={() => {
                      getExercisesByDate(exercise.date)
                  }}>{exercise.date}</TableCell>
                  <TableCell 
                    key={exercise.id}
                    onClick={() => {
                    getExercisesByName(exercise.name)
                  }}>{exercise.name}</TableCell>
                  <TableCell align="right">{exercise.reps}</TableCell>
                  <TableCell align="right">{exercise.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </React.Fragment>
  );
}