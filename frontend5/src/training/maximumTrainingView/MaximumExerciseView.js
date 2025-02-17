import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  MenuItem,
  FormControl,
  Select,
  Container,
  Typography
} from '@mui/material';

export default function MaximumExerciseView() {
  const [exercises, setExercises] = useState(() => []);
  const [loading, setLoading] = useState(() => true);
  const [trainingType, setTrainingType] = useState(() => 'A');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await REST.getATHTraining(trainingType);
        setExercises(response.content);
      } catch (error) {
        console.error('Failed to fetch training template', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [trainingType]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <Select
          onChange={e => setTrainingType(e.target.value)}
          defaultValue="A"
          displayEmpty
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
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Repetition</TableCell>
                <TableCell align="right">Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exercises.map((exercise) => (
                <TableRow
                  key={exercise.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{exercise.date}</TableCell>
                  <TableCell>{exercise.name}</TableCell>
                  <TableCell align="right">{exercise.reps}</TableCell>
                  <TableCell align="right">{exercise.weight}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
