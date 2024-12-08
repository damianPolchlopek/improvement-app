import React, {useEffect, useState} from 'react';
import REST from '../../utils/REST';

import {
  Container,

  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

  FormControl,
  MenuItem,
  Select,
} from '@mui/material';

export default function TrainingsView() {
  const [exerciseList, setExerciseList] = useState([]);
  const [trainingTemplate, setTrainingTemplate] = useState([]);
  const [trainingType, setTrainingType] = useState('A');

  useEffect(() => {

    REST.getTrainingByType(trainingType)
      .then(response => {
        setExerciseList(response.content)
        console.log(response.content)
      })
      .catch(error => {
        console.error('Failed to fetch training names', error);
      });

      REST.getTrainingTemplate(trainingType)
      .then(response => {
        
        console.log('Training template')
        console.log(response)
        setTrainingTemplate(response.exercises)
      })
      .catch(error => {
        console.error('Failed to fetch training names', error);
      });

  }, [trainingType]);

  return (
    <React.Fragment>
        <Container>
          
          <FormControl sx={{m: 1, minWidth: 120}}>
              <Select
                onChange={(e => setTrainingType(e.target.value))}
                defaultValue="A"
              >
                <MenuItem value="A">Siłowy A</MenuItem>
                <MenuItem value="B">Siłowy B</MenuItem>
                <MenuItem value="C">Hipertroficzny C</MenuItem>
                <MenuItem value="D">Hipertroficzny D</MenuItem>
                <MenuItem value="E">Basen</MenuItem>
                <MenuItem value="A1">Siłowy A1</MenuItem>
                <MenuItem value="B1">Siłowy B1</MenuItem>
                <MenuItem value="C1">Hipertroficzny C1</MenuItem>
                <MenuItem value="D1">Hipertroficzny D1</MenuItem>
              </Select>
            </FormControl>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    {trainingTemplate.map((value, index) => {
                      return <TableCell key={index}>
                        {value}
                        </TableCell>})}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {exerciseList.map((exerciseMap, index) => {
                    // Znajdź pierwsze ćwiczenie z datą
                    const firstAvailableExercise = Object.entries(exerciseMap).find(
                      ([key, value]) => value?.date
                    );
                    const date = firstAvailableExercise ? firstAvailableExercise[1].date : 'Brak danych';

                    return (
                      <TableRow key={index}>
                        {/* Wyświetl datę pierwszego dostępnego ćwiczenia */}
                        <TableCell>{date}</TableCell>
                        {trainingTemplate.map((exercise, index) => {
                          const exerciseData = exerciseMap?.[exercise] || {};
                          return (
                            <TableCell key={index}>
                              {/* Wyświetl wagę i powtórzenia */}
                              <div>Weight: {exerciseData.weight || 'N/A'}</div>
                              <div>Reps: {exerciseData.reps || 'N/A'}</div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>

              </Table>
            </TableContainer>



        </Container>
    </React.Fragment>
  );
}
