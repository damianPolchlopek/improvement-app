import React, { useEffect, useState } from "react";
import REST from "../../utils/REST";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Chip,
  Fade,
  Tooltip
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import { useLoaderData, Form, useNavigate } from "react-router-dom";
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/REST.js';
import ErrorAlert from "../../component/error/ErrorAlert.jsx";

import { TrainingViewUrl } from "../../utils/URLHelper.js";
import { 
  Add, 
  Remove, 
  FitnessCenter, 
  Send,
  LocationOn,
  Category,
  TrendingUp
} from '@mui/icons-material';

export default function TrainingForm({ exercises, isSimpleForm }) {
  const [exercisesFields, setExercisesFields] = useState(exercises)
  const {
    exerciseNames = [],
    exercisePlaces = [],
    exerciseProgresses = [],
    exerciseTypes = []
  } = useLoaderData() || {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (exercises) => REST.addTraining(exercises),
    onSuccess: () => {
      queryClient.invalidateQueries(['training-names', 0, 25]);
      navigate(TrainingViewUrl);
    },
    onError: (error) => {
      console.error('Failed to submit training:', error);
    },
  });

  useEffect(() => {
    setExercisesFields(exercises);
  }, [exercises]);

  function handleSubmit() {
    mutate(exercisesFields);
  }

  const handleFormChange = (index, attribut, event) => {
    let data = [...exercisesFields];
    data[index][attribut] = event.target.value;
    setExercisesFields(data);
  }

  const addFields = (index) => {
    let data = [...exercisesFields];
    data.splice(index + 1, 0, {type: '', place: '', name: '', reps: '', weight: '', progress: ''})
    setExercisesFields(data)
  }

  const removeFields = (index) => {
    let data = [...exercisesFields];
    data.splice(index, 1)
    setExercisesFields(data)
  }

  // Jeśli brak ćwiczeń, dodaj pierwsze puste
  if (exercisesFields.length === 0) {
    setExercisesFields([{type: '', place: '', name: '', reps: '', weight: '', progress: ''}]);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Box sx={{ mb: 4 }}>
        {exercisesFields.length === 0 ? (
          <Card elevation={2} sx={{ 
            textAlign: 'center', 
            py: 6,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}>
            <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Brak ćwiczeń w treningu
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Załaduj szablon treningu lub dodaj pierwsze ćwiczenie ręcznie
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => addFields(-1)}
              sx={{ 
                borderRadius: 25,
                px: 4
              }}
            >
              Dodaj pierwsze ćwiczenie
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {exercisesFields.map((input, index) => (
              <Grid xs={12} key={index}>
                <Fade in={true} timeout={300 + index * 100}>
                  <Card 
                    elevation={4} 
                    sx={{ 
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(0,0,0,0.08)',
                      // '&:hover': {
                      //   boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                      //   transform: 'translateY(-2px)'
                      // }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header z numerem ćwiczenia */}
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Chip 
                            label={`#${index + 1}`}
                            color="primary" 
                            sx={{ 
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              minWidth: 45
                            }}
                          />
                          <Typography variant="h6" fontWeight="600" color="text.primary">
                            Ćwiczenie {index + 1}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" gap={1}>
                          <Tooltip title="Dodaj ćwiczenie">
                            <IconButton 
                              color="success" 
                              onClick={() => addFields(index)}
                              sx={{ 
                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' }
                              }}
                            >
                              <Add />
                            </IconButton>
                          </Tooltip>
                          
                          {exercisesFields.length > 1 && (
                            <Tooltip title="Usuń ćwiczenie">
                              <IconButton 
                                color="error" 
                                onClick={() => removeFields(index)}
                                sx={{ 
                                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                                  '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                                }}
                              >
                                <Remove />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>

                      {/* Formularz ćwiczenia */}
                      <Grid container spacing={2}>
                        {/* Typ ćwiczenia */}
                        {!isSimpleForm ? (
                          <Grid xs={12} sm={6} md={3}>
                            <FormControl fullWidth variant="outlined" size="small">
                              <InputLabel>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Category fontSize="small" />
                                  {t('exercise.type')}
                                </Box>
                              </InputLabel>
                              <Select
                                name={`type-${index}`}
                                value={input.type}
                                onChange={(event) => handleFormChange(index, 'type', event)}
                                label={t('exercise.type')}
                              >
                                {exerciseTypes.map((et, i) => (
                                  <MenuItem key={i} value={et.name}>{et.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        ) : (
                          <input type="hidden" name={`type-${index}`} value={input.type} />
                        )}

                        {/* Miejsce ćwiczenia */}
                        {!isSimpleForm ? (
                          <Grid xs={12} sm={6} md={3}>
                            <FormControl fullWidth variant="outlined" size="small">
                              <InputLabel>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <LocationOn fontSize="small" />
                                  {t('exercise.place')}
                                </Box>
                              </InputLabel>
                              <Select
                                name={`place-${index}`}
                                value={input.place}
                                onChange={event => handleFormChange(index, 'place', event)}
                                label={t('exercise.place')}
                              >
                                {exercisePlaces.map((ep, i) => (
                                  <MenuItem key={i} value={ep.name}>{ep.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        ) : (
                          <input type="hidden" name={`place-${index}`} value={input.place} />
                        )}

                        {/* Nazwa ćwiczenia */}
                        <Grid xs={12} md={isSimpleForm ? 12 : 6}>
                          <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>
                              <Box display="flex" alignItems="center" gap={1}>
                                <FitnessCenter fontSize="small" />
                                {t('exercise.name')}
                              </Box>
                            </InputLabel>
                            <Select
                              name={`name-${index}`}
                              value={input.name}
                              onChange={event => handleFormChange(index, 'name', event)}
                              label={t('exercise.name')}
                            >
                              {exerciseNames.map((en, i) => (
                                <MenuItem key={i} value={en.name}>{en.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Powtórzenia */}
                        <Grid xs={6} sm={3}>
                          <TextField
                            fullWidth
                            label={t('exercise.reps')}
                            name={`reps-${index}`}
                            value={input.reps}
                            onChange={event => handleFormChange(index, 'reps', event)}
                            variant="outlined"
                            size="small"
                            inputProps={{ min: 0 }}
                          />
                        </Grid>

                        {/* Ciężar */}
                        <Grid xs={6} sm={3}>
                          <TextField
                            fullWidth
                            label={t('exercise.weight')}
                            name={`weight-${index}`}
                            value={input.weight}
                            onChange={event => handleFormChange(index, 'weight', event)}
                            variant="outlined"
                            size="small"
                            inputProps={{ min: 0, step: 0.5 }}
                            InputProps={{
                              endAdornment: <Typography variant="body2" color="text.secondary">kg</Typography>
                            }}
                          />
                        </Grid>

                        {/* Postęp */}
                        <Grid xs={12} sm={6}>
                          <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>
                              <Box display="flex" alignItems="center" gap={1}>
                                <TrendingUp fontSize="small" />
                                {t('exercise.progress')}
                              </Box>
                            </InputLabel>
                            <Select
                              name={`progress-${index}`}
                              value={input.progress}
                              onChange={event => handleFormChange(index, 'progress', event)}
                              label={t('exercise.progress')}
                            >
                              {exerciseProgresses.map((ep, i) => (
                                <MenuItem key={i} value={ep.name}>{ep.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Przycisk dodawania nowego ćwiczenia */}
      {exercisesFields.length > 0 && (
        <Box textAlign="center" mb={4}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Add />}
            onClick={() => addFields(exercisesFields.length - 1)}
            sx={{
              borderRadius: 25,
              px: 4,
              py: 1.5,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }
            }}
          >
            Dodaj kolejne ćwiczenie
          </Button>
        </Box>
      )}

      {/* Przycisk wysyłania */}
      <Box sx={{ 
        position: 'sticky',
        bottom: 20,
        zIndex: 1000,
        textAlign: 'center'
      }}>
        <Button 
          variant="contained" 
          size="large"
          type="submit"
          disabled={isPending || exercisesFields.length === 0}
          startIcon={isPending ? null : <Send />}
          sx={{
            minWidth: 200,
            py: 1.5,
            borderRadius: 25,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              transform: 'translateY(-2px)'
            },
            '&:disabled': {
              background: 'rgba(0,0,0,0.12)',
              boxShadow: 'none'
            }
          }}
        >
          {isPending ? (
            <Box display="flex" alignItems="center" gap={2}>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {t('messages.submitting')}
            </Box>
          ) : (
            t('messages.submit') || 'Zapisz Trening'
          )}
        </Button>
      </Box>

      {/* Błędy */}
      {isError && (
        <Box sx={{ mt: 3 }}>
          <ErrorAlert error={error} />
        </Box>
      )}
    </Form>
  );
}

export async function loader() {
  const exercisesNames = await REST.getExerciseNames();
  const exercisesPlaces = await REST.getExercisePlaces();
  const exercisesProgresses = await REST.getExerciseProgresses();
  const exercisesTypes = await REST.getExerciseTypes();

  return {
    exerciseNames: exercisesNames.content,
    exercisePlaces: exercisesPlaces.content,
    exerciseProgresses: exercisesProgresses.content,
    exerciseTypes: exercisesTypes.content
  };
}