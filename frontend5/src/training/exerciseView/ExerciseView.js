import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';

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

import { useTranslation } from 'react-i18next';

export default function ExerciseView() {
  const [exerciseList, setExerciseList] = useState([]);
  const [exerciseTemplate, setExerciseTemplate] = useState([]);
  const [selectedTrainingType, setSelectedTrainingType] = useState('A');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [listLength, setListLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainingResponse, templateResponse] = await Promise.all([
          REST.getTrainingByType(selectedTrainingType, page, size),
          REST.getTrainingTemplate(selectedTrainingType)
        ]);

        setListLength(trainingResponse.totalElements)
        setExerciseList(trainingResponse.content);
        setExerciseTemplate(templateResponse.exercises);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTrainingType, page, size]);

  const handleChangeSize = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <React.Fragment>
      <Container>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <TrainingTypeSelector 
            setTrainingType={setSelectedTrainingType}
          />
        </FormControl>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Data</StyledTableCell>
                  {exerciseTemplate.map((value, index) => (
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
                      {exerciseTemplate.map((exercise, index) => {
                        const exerciseData = exerciseMap?.[exercise] || {};
                        return (
                          <StyledTableCell key={index}>
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
                  <StyledTableCell colSpan={7}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      count={listLength}
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
    </React.Fragment>
  );
}
