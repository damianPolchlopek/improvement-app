import React, { useState, useRef, useEffect } from 'react';
import REST from '../../utils/REST';

import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
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
  Tooltip,
} from '@mui/material';

import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/REST.js';
import ErrorAlert from '../../component/error/ErrorAlert.jsx';

import { TrainingViewUrl } from '../../utils/URLHelper.js';
import {
  Add,
  Remove,
  FitnessCenter,
  Send,
  LocationOn,
  Category,
  TrendingUp,
} from '@mui/icons-material';

function withStableKey(exercise, fallbackIndex) {
  return { ...exercise, _key: exercise.id ?? `init-${fallbackIndex}-${Date.now()}` };
}

export default function TrainingForm({ exercises, isSimpleForm }) {
  const [exercisesFields, setExercisesFields] = useState(() => exercises.map(withStableKey));
  const [prevExercises, setPrevExercises] = useState(exercises);
  const [validationError, setValidationError] = useState('');

  // Referencje do pól nazwy ćwiczeń, by po dodaniu nowego wiersza ustawić w nim kursor
  const nameInputRefs = useRef({});
  const pendingFocusKey = useRef(null);

  const {
    exerciseNames = [],
    exercisePlaces = [],
    exerciseProgresses = [],
    exerciseTypes = [],
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

  // Resetuj pola formularza, gdy zmieni się prop `exercises`
  // (wzorzec React: adjust state during render zamiast useEffect + setState)
  if (exercises !== prevExercises) {
    setPrevExercises(exercises);
    setExercisesFields(exercises.map(withStableKey));
  }

  // Po dodaniu wiersza (Enter na ostatnim polu) ustaw kursor w nazwie nowego ćwiczenia
  useEffect(() => {
    if (pendingFocusKey.current) {
      const el = nameInputRefs.current[pendingFocusKey.current];
      if (el) el.focus();
      pendingFocusKey.current = null;
    }
  }, [exercisesFields]);

  function handleSubmit(event) {
    if (event) event.preventDefault();
    const invalid = exercisesFields.some((f) => !f.name || !f.reps || !f.weight);
    if (invalid) {
      setValidationError(t('training.fillAllFields'));
      return;
    }
    setValidationError('');
    mutate(exercisesFields);
  }

  const setField = (index, attribut, value) => {
    setExercisesFields((prev) => {
      const data = [...prev];
      data[index] = { ...data[index], [attribut]: value };
      return data;
    });
  };

  const handleFormChange = (index, attribut, event) => {
    setField(index, attribut, event.target.value);
  };

  // Dodaje nowe ćwiczenie na końcu i zaznacza je do ustawienia kursora (useEffect powyżej)
  const addRowAndFocus = () => {
    const newKey = crypto.randomUUID();
    setExercisesFields((prev) => [
      ...prev,
      { _key: newKey, type: '', place: '', name: '', reps: '', weight: '', progress: '' },
    ]);
    pendingFocusKey.current = newKey;
  };

  // Enter = przejdź do następnego pola (a na ostatnim dodaj ćwiczenie); Ctrl/Cmd+Enter = zapisz
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return;

    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      handleSubmit();
      return;
    }

    // Gdy lista podpowiedzi nazwy jest otwarta, zostaw Enter dla wyboru opcji
    if (document.querySelector('.MuiAutocomplete-popper')) return;

    const target = event.target;
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return;

    event.preventDefault();

    const fields = Array.from(event.currentTarget.querySelectorAll('input')).filter(
      (el) => el.type !== 'hidden' && el.tabIndex !== -1 && el.offsetParent !== null && !el.disabled
    );
    const idx = fields.indexOf(target);
    if (idx === -1) return;

    if (idx < fields.length - 1) {
      const next = fields[idx + 1];
      next.focus();
      if (next.select) next.select();
    } else {
      addRowAndFocus();
    }
  };

  const addFields = (index) => {
    let data = [...exercisesFields];
    data.splice(index + 1, 0, {
      _key: crypto.randomUUID(),
      type: '',
      place: '',
      name: '',
      reps: '',
      weight: '',
      progress: '',
    });
    setExercisesFields(data);
  };

  const removeFields = (index) => {
    let data = [...exercisesFields];
    data.splice(index, 1);
    setExercisesFields(data);
  };

  // Jeśli brak ćwiczeń, dodaj pierwsze puste
  if (exercisesFields.length === 0) {
    return (
      <Card
        elevation={2}
        sx={{
          py: 6,
          borderRadius: 3,
          background: 'color.second',
        }}
      >
        <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('training.noExercisesInTraining')}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {t('training.loadTemplateOrAdd')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => addFields(-1)}
          sx={{
            borderRadius: 25,
            px: 4,
          }}
        >
          {t('training.addFirstExercise')}
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {exercisesFields.map((input, index) => (
            <Grid size={12} key={input._key}>
              <Fade in={true} timeout={300 + index * 100}>
                <Card elevation={4}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Header z numerem ćwiczenia */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Chip label={`#${index + 1}`} color="primary" />
                        <Typography variant="h6">
                          {t('training.exerciseN', { n: index + 1 })}
                        </Typography>
                      </Box>

                      <Box display="flex" gap={1}>
                        <Tooltip title={t('training.addExercise')}>
                          <IconButton
                            color="success"
                            onClick={() => addFields(index)}
                            sx={{
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                              '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' },
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>

                        {exercisesFields.length > 1 && (
                          <Tooltip title={t('training.removeExercise')}>
                            <IconButton
                              color="error"
                              onClick={() => removeFields(index)}
                              sx={{
                                bgcolor: 'rgba(244, 67, 54, 0.1)',
                                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' },
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
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                                <MenuItem key={i} value={et.name}>
                                  {et.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      ) : (
                        <input type="hidden" name={`type-${index}`} value={input.type} />
                      )}

                      {/* Miejsce ćwiczenia */}
                      {!isSimpleForm ? (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                              onChange={(event) => handleFormChange(index, 'place', event)}
                              label={t('exercise.place')}
                            >
                              {exercisePlaces.map((ep, i) => (
                                <MenuItem key={i} value={ep.name}>
                                  {ep.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      ) : (
                        <input type="hidden" name={`place-${index}`} value={input.place} />
                      )}

                      {/* Nazwa ćwiczenia */}
                      <Grid size={{ xs: 12, md: isSimpleForm ? 12 : 6 }}>
                        <Autocomplete
                          freeSolo
                          autoHighlight
                          fullWidth
                          size="small"
                          options={exerciseNames.map((en) => en.name)}
                          inputValue={input.name || ''}
                          onInputChange={(event, newValue) =>
                            setField(index, 'name', newValue ?? '')
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t('exercise.name')}
                              autoFocus={index === 0}
                              inputRef={(el) => {
                                if (el) nameInputRefs.current[input._key] = el;
                              }}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <FitnessCenter fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                                ),
                              }}
                            />
                          )}
                        />
                      </Grid>

                      {/* Powtórzenia */}
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          label={t('exercise.reps')}
                          name={`reps-${index}`}
                          value={input.reps}
                          onChange={(event) => handleFormChange(index, 'reps', event)}
                          variant="outlined"
                          size="small"
                          inputProps={{ min: 0 }}
                        />
                      </Grid>

                      {/* Ciężar */}
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField
                          fullWidth
                          label={t('exercise.weight')}
                          name={`weight-${index}`}
                          value={input.weight}
                          onChange={(event) => handleFormChange(index, 'weight', event)}
                          variant="outlined"
                          size="small"
                          inputProps={{ min: 0, step: 0.5 }}
                          InputProps={{
                            endAdornment: (
                              <Typography variant="body2" color="text.secondary">
                                kg
                              </Typography>
                            ),
                          }}
                        />
                      </Grid>

                      {/* Postęp */}
                      <Grid size={{ xs: 12, sm: 6 }}>
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
                            onChange={(event) => handleFormChange(index, 'progress', event)}
                            label={t('exercise.progress')}
                          >
                            {exerciseProgresses.map((ep, i) => (
                              <MenuItem key={i} value={ep.name}>
                                {ep.name}
                              </MenuItem>
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
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              },
            }}
          >
            {t('training.addAnotherExercise')}
          </Button>
        </Box>
      )}

      {/* Przycisk wysyłania */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 20,
          zIndex: 1000,
          textAlign: 'center',
        }}
      >
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
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              background: 'rgba(0,0,0,0.12)',
              boxShadow: 'none',
            },
          }}
        >
          {isPending ? (
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={20} color="inherit" />
              {t('messages.submitting')}
            </Box>
          ) : (
            t('training.saveTraining')
          )}
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {t('training.saveHint')}
        </Typography>
      </Box>

      {/* Błąd walidacji */}
      {validationError && (
        <Box sx={{ mt: 2 }}>
          <FormHelperText error sx={{ fontSize: '0.95rem', textAlign: 'center' }}>
            {validationError}
          </FormHelperText>
        </Box>
      )}

      {/* Błędy serwera */}
      {isError && (
        <Box sx={{ mt: 3 }}>
          <ErrorAlert error={error} />
        </Box>
      )}
    </form>
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
    exerciseTypes: exercisesTypes.content,
  };
}
