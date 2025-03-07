import React, { useState } from 'react';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Collapse,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from '@mui/material';

import StyledTableRow from '../../component/table/StyledTableRow';
import StyledTableCell from '../../component/table/StyledTableCell';

export default function SingleTraining({ trainingName }) {
  const [exercises, setExercises] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleClick = () => {
    setIsOpen(open => !open);
    getExercisesByTrainingName(trainingName);
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
    <>
      <Box
        key={trainingName}
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
          padding: '10px',
          backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography>{trainingName}</Typography>
      </Box>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="right">{t('exercise.date')}</StyledTableCell>
                <StyledTableCell>{t('exercise.name')}</StyledTableCell>
                <StyledTableCell align="right">{t('exercise.reps')}</StyledTableCell>
                <StyledTableCell align="right">{t('exercise.weight')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {exercises.map((exercise) => (
                <StyledTableRow
                  key={exercise.id}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <StyledTableCell 
                    align="right" 
                    key={exercise.name}
                    onClick={() => {
                      getExercisesByDate(exercise.date)
                  }}>{exercise.date}</StyledTableCell>
                  <StyledTableCell 
                    key={exercise.id}
                    onClick={() => {
                    getExercisesByName(exercise.name)
                  }}>{exercise.name}</StyledTableCell>
                  <StyledTableCell align="right">{exercise.reps}</StyledTableCell>
                  <StyledTableCell align="right">{exercise.weight}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </>
  );
}