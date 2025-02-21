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
  FormControl,
  CircularProgress,
  Box
} from '@mui/material';

import { useTranslation } from 'react-i18next';

export default function ExerciseView() {
  const [exerciseList, setExerciseList] = useState([]);
  const [exerciseTemplate, setExerciseTemplate] = useState([]);
  const [selectedTrainingType, setSelectedTrainingType] = useState('A');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainingResponse, templateResponse] = await Promise.all([
          REST.getTrainingByType(selectedTrainingType),
          REST.getTrainingTemplate(selectedTrainingType)
        ]);

        setExerciseList(trainingResponse.content);
        setExerciseTemplate(templateResponse.exercises);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

      fetchData();
    }, [selectedTrainingType]);

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
          <TableContainer>
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
            </Table>
          </TableContainer>
        )}
      </Container>
    </React.Fragment>
  );
}
