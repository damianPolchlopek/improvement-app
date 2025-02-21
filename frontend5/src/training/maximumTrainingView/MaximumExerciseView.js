import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Box,
  CircularProgress,
  FormControl,
  Container
} from '@mui/material';

import StyledTableRow from '../../component/table/StyledTableRow'
import StyledTableCell from '../../component/table/StyledTableCell'
import TrainingTypeSelector from '../component/TrainingTypeSelector';

export default function MaximumExerciseView() {
  const [exercises, setExercises] = useState(() => []);
  const [loading, setLoading] = useState(() => true);
  const [trainingType, setTrainingType] = useState(() => 'A');
  const { t } = useTranslation();

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
        <TrainingTypeSelector 
          setTrainingType={setTrainingType}
        />
      </FormControl>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>{t('exercise.date')}</StyledTableCell>
                <StyledTableCell>{t('exercise.name')}</StyledTableCell>
                <StyledTableCell align="right">{t('exercise.reps')}</StyledTableCell>
                <StyledTableCell align="right">{t('exercise.weight')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {exercises.map((exercise) => (
                <StyledTableRow
                  key={exercise.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <StyledTableCell>{exercise.date}</StyledTableCell>
                  <StyledTableCell>{exercise.name}</StyledTableCell>
                  <StyledTableCell align="right">{exercise.reps}</StyledTableCell>
                  <StyledTableCell align="right">{exercise.weight}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
