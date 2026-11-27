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
  IconButton,
  Tooltip,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../utils/REST.js';
import ErrorAlert from '../../component/error/ErrorAlert.jsx';
import { HAIRLINE, LINE_COLOR, ROW_LINE, STATUS } from '../../tokens';
import SetPills from '../component/SetPills';
import { weightChange } from '../component/sets';
import { localeOf } from '../trainingView/trainingWeeks';

import { TrainingViewUrl } from '../../utils/URLHelper.js';
import {
  Add,
  ContentCopy,
  DeleteOutlined,
  KeyboardArrowUp,
  KeyboardArrowDown,
  FitnessCenter,
  Save,
  ArrowDropUp,
  ArrowDropDown,
} from '@mui/icons-material';

const VOLUME_COLOR = STATUS.up;
const UP_COLOR = STATUS.up;
const DOWN_COLOR = STATUS.down;

// Ciemniejsze tło pól – jak w wyszukiwarkach modułu food.
const inputSx = { '& .MuiInputBase-root': { bgcolor: 'surface.field' } };

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

// Szablon = ostatnia sesja, więc wczytane reps/weight są referencją "ostatnio".
function seedLastByName(exercises) {
  const seed = {};
  for (const ex of exercises) {
    if (ex.name && !(ex.name in seed)) {
      seed[ex.name] = { reps: ex.reps ?? '', weight: ex.weight ?? '' };
    }
  }
  return seed;
}

export default function TrainingForm({ exercises, isSimpleForm }) {
  const [exercisesFields, setExercisesFields] = useState(() => exercises.map(withStableKey));
  const [prevExercises, setPrevExercises] = useState(exercises);
  const [validationError, setValidationError] = useState('');
  // name -> { reps, weight } z ostatniej sesji (podpowiedź "ostatnio")
  const [lastByName, setLastByName] = useState(() => seedLastByName(exercises));

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
  const { t, i18n } = useTranslation();
  const locale = localeOf(i18n.language);
  const navigate = useNavigate();

  const nameOptions = useMemo(() => exerciseNames.map((en) => en.name), [exerciseNames]);
  const nameOptionsSet = useMemo(() => new Set(nameOptions), [nameOptions]);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (payload) => REST.addTraining(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-names'] }); // wszystkie strony listy
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

    setLastByName(seedLastByName(exercises));
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

  // Łączna objętość treningu (tylko wiersze z liczbowymi seriami).
  const totalVolume = exercisesFields.reduce((sum, f) => {
    if (!isNumericSeries(f.reps) || !isNumericSeries(f.weight)) return sum;
    if (String(f.reps).split('/').length !== String(f.weight).split('/').length) return sum;
    return sum + computeVolume(f.reps, f.weight);
  }, 0);

  if (exercisesFields.length === 0) {
    return (
      <Box
        sx={{
          py: 6,
          px: 2,
          textAlign: 'center',
          borderRadius: 2.5,
          border: `1px dashed ${LINE_COLOR.strong}`,
        }}
      >
        <FitnessCenter sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.6, mb: 1 }} />
        <Typography sx={{ fontWeight: 500 }} gutterBottom>
          {t('training.noExercisesInTraining')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {t('training.loadTemplateOrAdd')}
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => addFields(-1)}>
          {t('training.addFirstExercise')}
        </Button>
      </Box>
    );
  }

  const gridCols = {
    xs: '28px minmax(0, 1fr)',
    md: '28px minmax(160px, 1fr) 150px 170px 132px',
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      {/* Nagłówek kolumn (raz) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: gridCols,
          gap: 1,
          px: 1.5,
          pb: 1,
          borderBottom: HAIRLINE,
          '& > *': { fontSize: 12, fontWeight: 500, color: 'text.secondary' },
        }}
      >
        <Typography variant="caption" sx={{ textAlign: 'center' }}>
          #
        </Typography>
        <Typography variant="caption">{t('exercise.name')}</Typography>
        <Typography variant="caption">{t('exercise.reps')}</Typography>
        <Typography variant="caption">{t('exercise.weight')} (kg)</Typography>
        <span />
      </Box>

      {/* Wiersze ćwiczeń */}
      <Box sx={{ mb: 1.5 }}>
        {exercisesFields.map((input, index) => {
          const err = rowError(input);
          const formatError = err === 'series' || err === 'number';

          let meta = null;
          if (err === 'series') {
            meta = (
              <Typography variant="caption" sx={{ color: 'error.light' }}>
                {t('training.seriesMismatch', { n: index + 1 })}
              </Typography>
            );
          } else if (err === 'number') {
            meta = (
              <Typography variant="caption" sx={{ color: 'error.light' }}>
                {t('training.invalidNumber', { n: index + 1 })}
              </Typography>
            );
          } else {
            const parts = [];
            if (isNumericSeries(input.reps) && isNumericSeries(input.weight)) {
              const count = String(input.reps).split('/').length;
              if (count === String(input.weight).split('/').length) {
                parts.push(
                  <span key="sets">{t('training.setsCount', { count })}</span>,
                  <Box key="volume" component="span" sx={{ color: VOLUME_COLOR }}>
                    {t('training.volumeShort', {
                      value: computeVolume(input.reps, input.weight).toLocaleString(locale),
                    })}
                  </Box>
                );
              }
            }
            const last = lastByName[input.name];
            if (
              last &&
              (last.reps || last.weight) &&
              (last.reps !== input.reps || last.weight !== input.weight)
            ) {
              const diff = weightChange(input, last);
              parts.push(
                <Box
                  key="last"
                  component="span"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
                >
                  {t('training.lastTime')}
                  <SetPills reps={last.reps} weight={last.weight} size={12} />
                  {diff != null && diff !== 0 && (
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: diff > 0 ? UP_COLOR : DOWN_COLOR,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {diff > 0 ? (
                        <ArrowDropUp fontSize="small" sx={{ mx: -0.5 }} />
                      ) : (
                        <ArrowDropDown fontSize="small" sx={{ mx: -0.5 }} />
                      )}
                      {Math.abs(diff).toLocaleString(locale)} kg
                    </Box>
                  )}
                </Box>
              );
            }
            if (parts.length) {
              meta = (
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    color: 'text.secondary',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    columnGap: 2,
                    rowGap: 0.5,
                  }}
                >
                  {parts}
                </Typography>
              );
            }
          }

          return (
            <Box
              key={input._key}
              data-key={input._key}
              sx={{
                px: 1.5,
                py: 1,
                borderLeft: '3px solid',
                borderColor: formatError ? 'error.main' : 'transparent',
                borderBottom: ROW_LINE,
                transition: 'background-color 150ms',
                '&:hover, &:focus-within': { bgcolor: 'surface.hoverStrong' },
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
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    mx: 'auto',
                    borderRadius: '50%',
                    bgcolor: 'primaryTint.strong',
                    color: 'primary.main',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {index + 1}
                </Box>

                <Autocomplete
                  freeSolo
                  autoHighlight
                  fullWidth
                  size="small"
                  options={nameOptions}
                  inputValue={input.name || ''}
                  onInputChange={(event, newValue) => handleNameChange(index, newValue ?? '')}
                  sx={inputSx}
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
                  sx={{ ...inputSx, gridColumn: { xs: 2, md: 'auto' } }}
                />

                <TextField
                  fullWidth
                  size="small"
                  placeholder="50/50/50/50/50"
                  value={input.weight}
                  onChange={(event) => handleFormChange(index, 'weight', event)}
                  error={formatError}
                  sx={{ ...inputSx, gridColumn: { xs: 2, md: 'auto' } }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gridColumn: { xs: 2, md: 'auto' },
                    color: 'text.secondary',
                    '& .MuiIconButton-root': { color: 'inherit' },
                  }}
                >
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
                        disabled={exercisesFields.length <= 1}
                        onClick={() => removeFields(index)}
                        sx={{ '&:hover': { color: 'error.main' } }}
                      >
                        <DeleteOutlined fontSize="small" />
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
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 1,
                    mt: 1,
                    pl: '36px',
                  }}
                >
                  <FormControl size="small" fullWidth sx={inputSx}>
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

                  <FormControl size="small" fullWidth sx={inputSx}>
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

                  <FormControl size="small" fullWidth sx={inputSx}>
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

              {meta && <Box sx={{ pl: '36px', mt: 0.75 }}>{meta}</Box>}
            </Box>
          );
        })}
      </Box>

      {/* Dodaj ćwiczenie */}
      <Button
        variant="text"
        size="small"
        startIcon={<Add />}
        onClick={() => addFields(exercisesFields.length - 1)}
        sx={{ mb: 2, ml: 0.5 }}
      >
        {t('training.addAnotherExercise')}
      </Button>

      {(validationError || isError) && (
        <Box sx={{ mb: 2 }}>
          {validationError && (
            <FormHelperText error sx={{ fontSize: '0.9rem', mx: 1.5 }}>
              {validationError}
            </FormHelperText>
          )}
          {isError && <ErrorAlert error={error} />}
        </Box>
      )}

      {/* Pasek zapisu – na desktopie przyklejony do dołu ekranu; na telefonie zwykły
          element pod listą ćwiczeń, żeby nie zasłaniał pól przy wpisywaniu. */}
      <Box
        sx={{
          position: { xs: 'static', md: 'sticky' },
          bottom: 16,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          px: 2,
          py: 1.25,
          borderRadius: 3,
          bgcolor: 'surface.overlay',
          border: HAIRLINE,
          boxShadow: { xs: 'none', md: '0 8px 24px rgba(0,0,0,0.35)' },
        }}
      >
        <Box sx={{ minWidth: 0, flex: '1 1 240px' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t('training.exercisesInTemplate', { count: exercisesFields.length })}
            {totalVolume > 0 && (
              <Box component="span" sx={{ color: VOLUME_COLOR, ml: 1.5 }}>
                {t('training.volumeShort', { value: totalVolume.toLocaleString(locale) })}
              </Box>
            )}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}
          >
            {t('training.saveHint')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          type="submit"
          disabled={isPending || exercisesFields.length === 0}
          startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <Save />}
          sx={{ px: 3 }}
        >
          {isPending ? t('messages.submitting') : t('training.saveTraining')}
        </Button>
      </Box>
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
