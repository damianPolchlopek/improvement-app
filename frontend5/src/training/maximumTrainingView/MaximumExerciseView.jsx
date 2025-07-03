import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import ErrorAlert from '../../component/error/ErrorAlert';
import InformationComponent from '../../component/InformationComponent';

export default function MaximumExerciseView() {
  const [trainingType, setTrainingType] = useState('A');
  const { t } = useTranslation();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ath-training', trainingType],
    queryFn: () => REST.getATHTraining(trainingType),
    staleTime: 1000 * 60 * 5, // 5 min
    cacheTime: 1000 * 60 * 10, // 10 min
  });

  if (data && data.content && data.content.length === 0) {
    return <InformationComponent>Trainings have not been added yet!</InformationComponent>
  }  

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <TrainingTypeSelector setTrainingType={setTrainingType} />
      </FormControl>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <ErrorAlert error={error} />
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
              {data.content.map((exercise) => (
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
