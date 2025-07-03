import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';
import ErrorAlert from '../../component/error/ErrorAlert';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import TrainingTypeSelector from '../component/TrainingTypeSelector';
import InformationComponent from '../../component/InformationComponent';

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  FormControl,
  CircularProgress,
  Box,
  TablePagination,
  TableFooter,
  Card,
  CardContent,
  Typography,
  Alert,
  Fade,
  Chip
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { 
  FitnessCenter, 
  ViewList,
  TrendingUp
} from '@mui/icons-material';

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

  if (trainingData && trainingData.content && trainingData.content.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Grid xs={12}>
            <InformationComponent>Trainings have not been added yet!</InformationComponent>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 4,
    }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        
        {/* Header Section */}
        <Grid xs={12}>
          <Card elevation={6} sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            mb: 2
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TrendingUp sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  Historia Treningów
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Przeglądaj historię swoich treningów i śledź postępy
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Training Type Selector */}
        <Grid xs={12} md={4}>
          <Card elevation={6} sx={{ 
            height: '100%',
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <FitnessCenter sx={{ color: '#4caf50', fontSize: 28 }} />
                <Typography variant="h6" fontWeight="600">
                  Typ Treningu
                </Typography>
              </Box>
              
              <FormControl fullWidth>
                <TrainingTypeSelector setTrainingType={setSelectedTrainingType} />
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Cards */}
        <Grid xs={12} md={8}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid xs={12} sm={6}>
              <Card elevation={4} sx={{ 
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(45deg, #4caf50, #45a049)',
                color: 'white'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="700">
                    {trainingData?.totalElements || 0}
                  </Typography>
                  <Typography variant="body1">
                    Łączna liczba treningów
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6}>
              <Card elevation={4} sx={{ 
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                color: 'white'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="700">
                    {templateData?.exercises?.length || 0}
                  </Typography>
                  <Typography variant="body1">
                    Liczba ćwiczeń
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Loading State */}
        {isLoading && (
          <Grid xs={12}>
            <Card elevation={6}>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Ładowanie danych...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Error State */}
        {isError && (
          <Grid xs={12}>
            <Fade in={true}>
              <Alert 
                severity="error" 
                sx={{ borderRadius: 2, fontSize: '1.1rem' }}
              >
                <ErrorAlert error={(trainingError || templateError)} />
              </Alert>
            </Fade>
          </Grid>
        )}

        {/* Training Data Table */}
        {!isLoading && !isError && trainingData && templateData && (
          <Grid xs={12}>
            <Card elevation={8} sx={{ 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <ViewList sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight="600">
                  Historia Treningów - Typ {selectedTrainingType}
                </Typography>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>
                        <Typography variant="subtitle1" fontWeight="600">
                          Data
                        </Typography>
                      </StyledTableCell>
                      {templateData.exercises.map((value, index) => (
                        <StyledTableCell key={index}>
                          <Typography variant="subtitle1" fontWeight="600">
                            {value}
                          </Typography>
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {trainingData.content.map((trainingDay, index) => {
                      const trainingDate = trainingDay.date || 'Brak danych';
                      const exercisesMap = trainingDay.exercises || {};

                      return (
                        <StyledTableRow key={index}>
                          <StyledTableCell>
                            <Typography variant="body1" fontWeight="500">
                              {trainingDate}
                            </Typography>
                          </StyledTableCell>
                          {templateData.exercises.map((exerciseName, exerciseIndex) => {
                            const exerciseData = exercisesMap[exerciseName] || {};
                            return (
                              <StyledTableCell key={exerciseIndex}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                }}>
                                  <Typography variant="body2" color="text.primary">
                                    <strong>{t('exercise.weight')}:</strong> {exerciseData.weight || 'N/A'}
                                  </Typography>
                                  <Typography variant="body2" color="text.primary">
                                    <strong>{t('exercise.reps')}:</strong> {exerciseData.reps || 'N/A'}
                                  </Typography>
                                </Box>
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
                          sx={{
                            '.MuiTablePagination-toolbar': {
                              fontSize: '1rem'
                            }
                          }}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}