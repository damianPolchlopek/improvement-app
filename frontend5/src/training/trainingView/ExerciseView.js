import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';

import {
  Container,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Box
} from '@mui/material';

export default function TrainingsView() {
  const [exerciseList, setExerciseList] = useState([]);
  const [trainingTemplate, setTrainingTemplate] = useState([]);
  const [trainingType, setTrainingType] = useState('A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      REST.getTrainingByType(trainingType)
        .then(response => {
          setExerciseList(response.content);
        })
        .catch(error => {
          console.error('Failed to fetch training names', error);
        }),

      REST.getTrainingTemplate(trainingType)
        .then(response => {
          setTrainingTemplate(response.exercises);
        })
        .catch(error => {
          console.error('Failed to fetch training template', error);
        })
    ])
      .finally(() => {
        setLoading(false);
      });
  }, [trainingType]);

  return (
    <React.Fragment>
      <Container>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            onChange={e => setTrainingType(e.target.value)}
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Data</StyledTableCell>
                  {trainingTemplate.map((value, index) => (
                    <StyledTableCell key={index}>{value}</StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {exerciseList.map((exerciseMap, index) => {
                  const firstAvailableExercise = Object.entries(exerciseMap).find(
                    ([, value]) => value?.date
                  );
                  const date = firstAvailableExercise ? firstAvailableExercise[1].date : 'Brak danych';

                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{date}</StyledTableCell>
                      {trainingTemplate.map((exercise, index) => {
                        const exerciseData = exerciseMap?.[exercise] || {};
                        return (
                          <StyledTableCell key={index}>
                            <div>Weight: {exerciseData.weight || 'N/A'}</div>
                            <div>Reps: {exerciseData.reps || 'N/A'}</div>
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </React.Fragment>
  );
}
