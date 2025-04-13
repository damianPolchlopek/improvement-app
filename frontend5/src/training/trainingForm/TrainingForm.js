import React, { useEffect, useState } from "react";
import REST from "../../utils/REST";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import { useLoaderData, Form, redirect } from "react-router-dom";


export default function TrainingForm({ exercises, isSimpleForm }) {
  const [exercisesFields, setExercisesFields] = useState(exercises)

  const {
    exerciseNames = [],
    exercisePlaces = [],
    exerciseProgresses = [],
    exerciseTypes = []
  } = useLoaderData() || {};
  
  const { t } = useTranslation();

  useEffect(() => {
    setExercisesFields(exercises);
  }, [exercises]);

  const handleFormChange = (index, attribut, event) => {
    console.log(attribut + ' ' + event.target.value)
    let data = [...exercisesFields];
    data[index][attribut] = event.target.value;

    console.log(data)
    setExercisesFields(data);
  }

  const addFields = (index) => {
    let data = [...exercisesFields];
    data.splice(index + 1, 0, {type: '', place: '', name: '', reps: '', weight: '', progress: ''})
    console.log(data)
    setExercisesFields(data)
  }

  const removeFields = (index) => {
    let data = [...exercisesFields];
    data.splice(index, 1)
    setExercisesFields(data)
  }

  const styleFormControl = {
    variant: "standard",
    sx: {
      m: 1
    }
  }

  return (
    <Form method="post">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">{t('messages.trainingSchema')}</Typography>
        </Grid>

        <Grid item xs={12}>
          {exercisesFields.map((input, index) => (
            <div key={index}>
              <FormControl {...styleFormControl} sx={{width: '50px'}}>
                <Typography display="inline">{index}</Typography>
              </FormControl>

              {!isSimpleForm ? (
                <FormControl {...styleFormControl} disabled={isSimpleForm}>
                  <InputLabel>{t('exercise.type')}</InputLabel>
                  <Select
                    name={`type-${index}`}
                    value={input.type}
                    onChange={(event) => handleFormChange(index, 'type', event)}
                    size="small"
                  >
                    {exerciseTypes.map((et, i) => (
                      <MenuItem key={i} value={et.type}>
                        {et.type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <input
                  type="hidden"
                  name={`type-${index}`}
                  value={input.type}
                />
              )}

              {!isSimpleForm ? (
                <FormControl {...styleFormControl}>
                  <InputLabel>{t('exercise.place')}</InputLabel>
                  <Select
                    name={`place-${index}`}
                    value={input.place}
                    onChange={event => handleFormChange(index, 'place', event)}
                    size="small"
                  >
                    {exercisePlaces.map((ep, i) => (
                      <MenuItem key={i} value={ep.place}>{ep.place}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <input
                  type="hidden"
                  name={`place-${index}`}
                  value={input.place}
                />
              )}

              <FormControl {...styleFormControl} sx={{width: '500px'}}>
                <InputLabel>{t('exercise.name')}</InputLabel>
                <Select
                  name={`name-${index}`}
                  value={input.name}
                  onChange={event => handleFormChange(index, 'name', event)}
                  size="small"
                >
                  {exerciseNames.map((en, i) => (
                    <MenuItem key={i} value={en.name}>{en.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl {...styleFormControl}>
                <TextField
                  label={t('exercise.reps')}
                  name={`reps-${index}`}
                  value={input.reps}
                  onChange={event => handleFormChange(index, 'reps', event)}
                  variant="outlined"
                  size="small"
                />
              </FormControl>

              <FormControl {...styleFormControl}>
                <TextField
                  label={t('exercise.weight')}
                  name={`weight-${index}`}
                  value={input.weight}
                  onChange={event => handleFormChange(index, 'weight', event)}
                  variant="outlined"
                  size="small"
                  sx={{width: '260px'}}
                />
              </FormControl>

              <FormControl {...styleFormControl} sx={{width: '100px'}}>
                <InputLabel>{t('exercise.progress')}</InputLabel>
                <Select
                  name={`progress-${index}`}
                  value={input.progress}
                  onChange={event => handleFormChange(index, 'progress', event)}
                  size="small"
                >
                  {exerciseProgresses.map((ep, i) => (
                    <MenuItem key={i} value={ep.progress}>{ep.progress}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl {...styleFormControl}>
                <Button variant="contained" color="success" onClick={() => addFields(index)}>
                  {t('messages.add')}
                </Button>
              </FormControl>
              <FormControl {...styleFormControl}>
                <Button variant="contained" color="error" onClick={() => removeFields(index)}>
                  {t('messages.remove')}
                </Button>
              </FormControl>
            </div>
          ))}
        </Grid>

        <Grid xs={12}>
          <Button variant="contained" type="submit">{t('messages.submit')}</Button>
        </Grid>
      </Grid>
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

export async function action({ request }) {
  const formData = await request.formData();
  const exercises = [];

  const indexes = [...new Set(
    Array.from(formData.keys())
      .map(key => key.match(/-(\d+)$/)?.[1])
      .filter(Boolean)
  )];

  for (const index of indexes) {
    exercises.push({
      type: formData.get(`type-${index}`),
      place: formData.get(`place-${index}`),
      name: formData.get(`name-${index}`),
      reps: formData.get(`reps-${index}`),
      weight: formData.get(`weight-${index}`),
      progress: formData.get(`progress-${index}`)
    });
  }

  try {
    await REST.addTraining(exercises);
    return redirect('/training/view');
  } catch (error) {
    console.error("Failed to submit training:", error);
    throw error;
  }
}