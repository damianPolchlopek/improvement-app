import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  IconButton,
  Tooltip,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/REST.js';
import ErrorAlert from '../../component/error/ErrorAlert.jsx';

import { TrainingViewUrl } from '../../utils/URLHelper.js';
import {
  Add,
  ContentCopy,
  DeleteOutline,
  KeyboardArrowUp,
  KeyboardArrowDown,
  FitnessCenter,
  Send,
} from '@mui/icons-material';

function withStableKey(exercise, fallbackIndex) {
  // _key zawsze string — porównujemy go z atrybutem data-key (zawsze string)
  return {
    ...exercise,
    _key: exercise.id != null ? String(exercise.id) : `init-${fallbackIndex}-${Date.now()}`,
  };
}

const emptyRow = () => ({
  _key: crypto.randomUUID(),
  type: '',
  place: '',
  name: '',
  reps: '',
  weight: '',
  progress: '',
});

// Czy string to czysta lista liczb oddzielonych "/" (np. "5/5/5").
// Wartości kardio/rower mają jednostki ("5 km", "12 km/h") — wtedy false i pomijamy walidację.
const isNumericSeries = (s) => {
  const parts = String(s ?? '').split('/');
  return parts.length > 0 && parts.every((p) => p.trim() !== '' && Number.isFinite(Number(p)));
};

// 'name' | 'empty' | 'series' | 'number' | null
function rowError(f) {
  if (!f.name) return 'name';
  const reps = String(f.reps ?? '').trim();
  const weight = String(f.weight ?? '').trim();
  if (!reps || !weight) return 'empty';
  if (!isNumericSeries(reps) || !isNumericSeries(weight)) return null; // kardio/jednostki — nie walidujemy
  if (reps.split('/').length !== weight.split('/').length) return 'series';
  return null;
}

const computeVolume = (reps, weight) => {
  const r = String(reps).split('/');
  const w = String(weight).split('/');
  let v = 0;
  for (let i = 0; i < r.length; i++) v += (parseFloat(r[i]) || 0) * (parseFloat(w[i]) || 0);
  return Math.round(v);
};

export default function TrainingForm({ exercises, isSimpleForm }) {
  const [exercisesFields, setExercisesFields] = useState(() => exercises.map(withStableKey));
  const [prevExercises, setPrevExercises] = useState(exercises);
  const [validationError, setValidationError] = useState('');
  // name -> { reps, weight } z ostatniej sesji (podpowiedź "ostatnio")
  const [lastByName, setLastByName] = useState({});

  const nameInputRefs = useRef({});
  const pendingFocusKey = useRef(null);
  const requestedNames = useRef(new Set());
  const formRef = useRef(null);

  const {
    exerciseNames = [],
    exercisePlaces = [],
    exerciseProgresses = [],
    exerciseTypes = [],
  } = useLoaderData() || {};
  const { t } = useTranslation();
  const navigate = useNavigate();

  const nameOptions = useMemo(() => exerciseNames.map((en) => en.name), [exerciseNames]);
  const nameOptionsSet = useMemo(() => new Set(nameOptions), [nameOptions]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (payload) => REST.addTraining(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['training-names', 0, 25]);
      navigate(TrainingViewUrl);
    },
    onError: (err) => {
      console.error('Failed to submit training:', err);
    },
  });

  // Reset pól + seed referencji "ostatnio" przy zmianie propa `exercises`
  // (wzorzec React: adjust state during render). Szablon = ostatnia sesja,
  // więc wczytane reps/weight są naszą referencją "ostatnio".
  if (exercises !== prevExercises) {
    setPrevExercises(exercises);
    setExercisesFields(exercises.map(withStableKey));

    const seed = {};
    for (const ex of exercises) {
      if (ex.name && !(ex.name in seed)) {
        seed[ex.name] = { reps: ex.reps ?? '', weight: ex.weight ?? '' };
      }
    }
    setLastByName(seed);
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

    const missing = exercisesFields.some(
      (f) => !f.name || !String(f.reps).trim() || !String(f.weight).trim()
    );
    if (missing) {
      setValidationError(t('training.fillAllFields'));
      return;
    }

    const badIndex = exercisesFields.findIndex((f) => {
      const e = rowError(f);
      return e === 'series' || e === 'number';
    });
    if (badIndex !== -1) {
      const e = rowError(exercisesFields[badIndex]);
      const key = e === 'series' ? 'training.seriesMismatch' : 'training.invalidNumber';
      setValidationError(t(key, { n: badIndex + 1 }));
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

  // Pobiera ostatnie reps/weight dla nazwy i (jeśli puste) podpowiada w pustych wierszach
  const ensureLastForName = (name) => {
    if (!name || !nameOptionsSet.has(name)) return;
    if (name in lastByName || requestedNames.current.has(name)) return;
    requestedNames.current.add(name);

    REST.getLastExerciseByName(name)
      .then((data) => {
        const val =
          data && (data.reps || data.weight)
            ? { reps: data.reps, weight: data.weight }
            : { reps: '', weight: '' };
        setLastByName((prev) => ({ ...prev, [name]: val }));

        if (val.reps || val.weight) {
          setExercisesFields((prev) =>
            prev.map((row) =>
              row.name === name && !String(row.reps).trim() && !String(row.weight).trim()
                ? { ...row, reps: val.reps, weight: val.weight }
                : row
            )
          );
        }
      })
      .catch(() => {
        setLastByName((prev) => ({ ...prev, [name]: { reps: '', weight: '' } }));
      });
  };

  const handleNameChange = (index, newName) => {
    setField(index, 'name', newName);
    if (!newName || !nameOptionsSet.has(newName)) return;

    const cached = lastByName[newName];
    if (cached) {
      if (cached.reps || cached.weight) {
        setExercisesFields((prev) =>
          prev.map((row, i) =>
            i === index && !String(row.reps).trim() && !String(row.weight).trim()
              ? { ...row, reps: cached.reps, weight: cached.weight }
              : row
          )
        );
      }
    } else {
      ensureLastForName(newName);
    }
  };

  // Nowe wiersze dziedziczą typ/miejsce z sąsiada — sensowny domyślny kontekst
  // i zabezpieczenie przed pustym typem (backend wymaga prawidłowego typu).
  const addFields = (index) => {
    setExercisesFields((prev) => {
      const data = [...prev];
      const base = prev[index] || {};
      data.splice(index + 1, 0, { ...emptyRow(), type: base.type ?? '', place: base.place ?? '' });
      return data;
    });
  };

  const addRowAndFocus = () => {
    const last = exercisesFields[exercisesFields.length - 1] || {};
    const row = { ...emptyRow(), type: last.type ?? '', place: last.place ?? '' };
    setExercisesFields((prev) => [...prev, row]);
    pendingFocusKey.current = row._key;
  };

  const duplicateRow = (index) => {
    setExercisesFields((prev) => {
      const data = [...prev];
      data.splice(index + 1, 0, { ...data[index], _key: crypto.randomUUID() });
      return data;
    });
  };

  const removeFields = (index) => {
    setExercisesFields((prev) => prev.filter((_, i) => i !== index));
  };

  const moveRow = (index, dir) => {
    setExercisesFields((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const data = [...prev];
      [data[index], data[target]] = [data[target], data[index]];
      return data;
    });
  };

  // Alt+↑/↓ = przenieś wiersz. Natywny listener w fazie capture na `document` łapie
  // zdarzenie zanim dotrze do MUI Autocomplete (które normalnie przejmuje strzałki).
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return;
      const targetEl = event.target;
      if (!targetEl || !formRef.current || !formRef.current.contains(targetEl)) return;
      const rowEl = targetEl.closest && targetEl.closest('[data-key]');
      if (!rowEl) return;
      const key = rowEl.getAttribute('data-key');
      event.preventDefault();
      event.stopPropagation();
      setExercisesFields((prev) => {
        const index = prev.findIndex((f) => String(f._key) === key);
        if (index === -1) return prev;
        const target = index + (event.key === 'ArrowUp' ? -1 : 1);
        if (target < 0 || target >= prev.length) return prev;
        const data = [...prev];
        [data[index], data[target]] = [data[target], data[index]];
        return data;
      });
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, []);

  // Enter = następne pole (na ostatnim dodaj wiersz); Ctrl/Cmd+Enter = zapis
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return;

    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      handleSubmit();
      return;
    }

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

  if (exercisesFields.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{ py: 6, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}
      >
        <FitnessCenter sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
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
          sx={{ borderRadius: 25, px: 4 }}
        >
          {t('training.addFirstExercise')}
        </Button>
      </Card>
    );
  }

  const gridCols = '36px minmax(150px, 1fr) 140px 150px 132px';

  return (
    <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      {/* Nagłówek kolumn (raz) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 1,
          px: 1,
          py: 1,
          borderBottom: '2px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          #
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('exercise.name')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('exercise.reps')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('exercise.weight')} (kg)
        </Typography>
        <span />
      </Box>

      {/* Wiersze ćwiczeń */}
      <Box sx={{ mb: 3 }}>
        {exercisesFields.map((input, index) => {
          const err = rowError(input);
          const formatError = err === 'series' || err === 'number';

          let meta = null;
          if (err === 'series') {
            meta = (
              <Typography variant="caption" color="error">
                {t('training.seriesMismatch', { n: index + 1 })}
              </Typography>
            );
          } else if (err === 'number') {
            meta = (
              <Typography variant="caption" color="error">
                {t('training.invalidNumber', { n: index + 1 })}
              </Typography>
            );
          } else {
            const parts = [];
            if (isNumericSeries(input.reps) && isNumericSeries(input.weight)) {
              const count = String(input.reps).split('/').length;
              if (count === String(input.weight).split('/').length) {
                parts.push(t('training.setsCount', { count }));
                parts.push(
                  t('training.volumeShort', { value: computeVolume(input.reps, input.weight) })
                );
              }
            }
            const last = lastByName[input.name];
            if (
              last &&
              (last.reps || last.weight) &&
              (last.reps !== input.reps || last.weight !== input.weight)
            ) {
              parts.push(`${t('training.lastTime')}: ${last.reps} / ${last.weight}`);
            }
            if (parts.length) {
              meta = (
                <Typography variant="caption" color="text.secondary">
                  {parts.join('  ·  ')}
                </Typography>
              );
            }
          }

          return (
            <Box
              key={input._key}
              data-key={input._key}
              sx={{
                px: 1,
                py: 1,
                borderLeft: '3px solid',
                borderColor: formatError ? 'error.main' : 'transparent',
                borderBottom: '1px solid',
                borderBottomColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: gridCols,
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {index + 1}
                </Typography>

                <Autocomplete
                  freeSolo
                  autoHighlight
                  fullWidth
                  size="small"
                  options={nameOptions}
                  inputValue={input.name || ''}
                  onInputChange={(event, newValue) => handleNameChange(index, newValue ?? '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('exercise.name')}
                      autoFocus={index === 0}
                      inputRef={(el) => {
                        if (el) nameInputRefs.current[input._key] = el;
                      }}
                    />
                  )}
                />

                <TextField
                  fullWidth
                  size="small"
                  placeholder="5/5/5/5/5"
                  value={input.reps}
                  onChange={(event) => handleFormChange(index, 'reps', event)}
                />

                <TextField
                  fullWidth
                  size="small"
                  placeholder="50/50/50/50/50"
                  value={input.weight}
                  onChange={(event) => handleFormChange(index, 'weight', event)}
                  error={err === 'series' || err === 'number'}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip title={t('training.moveUp')}>
                    <span>
                      <IconButton
                        size="small"
                        disabled={index === 0}
                        onClick={() => moveRow(index, -1)}
                      >
                        <KeyboardArrowUp fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={t('training.moveDown')}>
                    <span>
                      <IconButton
                        size="small"
                        disabled={index === exercisesFields.length - 1}
                        onClick={() => moveRow(index, 1)}
                      >
                        <KeyboardArrowDown fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={t('training.duplicateExercise')}>
                    <IconButton size="small" onClick={() => duplicateRow(index)}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('training.removeExercise')}>
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={exercisesFields.length <= 1}
                        onClick={() => removeFields(index)}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>

              {/* Tryb zaawansowany: typ / miejsce / postęp */}
              {!isSimpleForm && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1,
                    mt: 1,
                    pl: '44px',
                  }}
                >
                  <FormControl size="small" fullWidth>
                    <InputLabel>{t('exercise.type')}</InputLabel>
                    <Select
                      value={input.type}
                      label={t('exercise.type')}
                      onChange={(event) => handleFormChange(index, 'type', event)}
                    >
                      {exerciseTypes.map((et, i) => (
                        <MenuItem key={i} value={et.name}>
                          {et.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" fullWidth>
                    <InputLabel>{t('exercise.place')}</InputLabel>
                    <Select
                      value={input.place}
                      label={t('exercise.place')}
                      onChange={(event) => handleFormChange(index, 'place', event)}
                    >
                      {exercisePlaces.map((ep, i) => (
                        <MenuItem key={i} value={ep.name}>
                          {ep.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" fullWidth>
                    <InputLabel>{t('exercise.progress')}</InputLabel>
                    <Select
                      value={input.progress}
                      label={t('exercise.progress')}
                      onChange={(event) => handleFormChange(index, 'progress', event)}
                    >
                      {exerciseProgresses.map((ep, i) => (
                        <MenuItem key={i} value={ep.name}>
                          {ep.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {meta && <Box sx={{ pl: '44px', mt: 0.5 }}>{meta}</Box>}
            </Box>
          );
        })}
      </Box>

      {/* Dodaj ćwiczenie */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => addFields(exercisesFields.length - 1)}
          sx={{ borderRadius: 25, px: 3 }}
        >
          {t('training.addAnotherExercise')}
        </Button>
      </Box>

      {/* Pasek zapisu */}
      <Box sx={{ position: 'sticky', bottom: 16, zIndex: 1000, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          type="submit"
          disabled={isPending || exercisesFields.length === 0}
          startIcon={isPending ? null : <Send />}
          sx={{
            minWidth: 220,
            py: 1.5,
            borderRadius: 25,
            fontSize: '1.05rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            },
            '&:disabled': { background: 'rgba(0,0,0,0.12)', boxShadow: 'none' },
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

      {validationError && (
        <Box sx={{ mt: 2 }}>
          <FormHelperText error sx={{ fontSize: '0.95rem', textAlign: 'center' }}>
            {validationError}
          </FormHelperText>
        </Box>
      )}

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
