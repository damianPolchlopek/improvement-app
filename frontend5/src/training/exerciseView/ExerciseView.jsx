import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';
import ErrorAlert from '../../component/error/ErrorAlert';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import TrainingTypeSelector from '../component/TrainingTypeSelector';

import {
  Container,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  FormControl,
  CircularProgress,
  Box,
  TablePagination,
  TableFooter
} from '@mui/material';

export default function ExerciseView() {
  const [selectedTrainingType, setSelectedTrainingType] = useState('A');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { t } = useTranslation();

  const {
    data: trainingData,
    isLoading: isTrainingLoading,
    isError: isTrainingError,
    error: trainingError
  } = useQuery({
    queryKey: ['training-by-type', selectedTrainingType, page, size],
    queryFn: () => REST.getTrainingByType(selectedTrainingType, page, size),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5
  });

  const {
    data: templateData,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
    error: templateError
  } = useQuery({
    queryKey: ['training-template', selectedTrainingType],
    queryFn: () => REST.getTrainingTemplate(selectedTrainingType),
    staleTime: 1000 * 60 * 10
  });

  const handleChangeSize = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isLoading = isTrainingLoading || isTemplateLoading;
  const isError = isTrainingError || isTemplateError;

  return (
    <Container>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <TrainingTypeSelector setTrainingType={setSelectedTrainingType} />
      </FormControl>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
          <ErrorAlert error={(trainingError || templateError)} />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Data</StyledTableCell>
                {templateData.exercises.map((value, index) => (
                  <StyledTableCell key={index}>{value}</StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {trainingData.content.map((trainingDay, index) => {
                // trainingDay ma teraz strukturę: { date: "2024-06-19", exercises: { "Bench Press": {...}, "Squats": {...} } }
                const trainingDate = trainingDay.date || 'Brak danych';
                const exercisesMap = trainingDay.exercises || {};

                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{trainingDate}</StyledTableCell>
                    {templateData.exercises.map((exerciseName, exerciseIndex) => {
                      const exerciseData = exercisesMap[exerciseName] || {};
                      return (
                        <StyledTableCell key={exerciseIndex}>
                          <div>{t('exercise.weight')}: {exerciseData.weight || 'N/A'}</div>
                          <div>{t('exercise.reps')}: {exerciseData.reps || 'N/A'}</div>
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <StyledTableRow>
                <StyledTableCell colSpan={templateData.exercises.length + 1}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    count={trainingData.totalElements}
                    rowsPerPage={size}
                    component="div"
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeSize}
                  />
                </StyledTableCell>
              </StyledTableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
