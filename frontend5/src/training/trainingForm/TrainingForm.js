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
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';


export default function TrainingForm(props) {
  const [exercisesFields, setExercisesFields] = useState([
    {type: '', place: '', name: '', reps: '', weight: '', progress: ''},
  ])

  const [exerciseNames, setExerciseNames] = useState([]);
  const [exercisePlaces, setExercisePlaces] = useState([]);
  const [exerciseProgresses, setExerciseProgresses] = useState([]);
  const [exerciseTypes, setExerciseTypes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    REST.getExerciseNames().then(response => {
      setExerciseNames(response.content);
    });

    REST.getExercisePlaces().then(response => {
      setExercisePlaces(response.content);
    });

    REST.getExerciseProgresses().then(response => {
      setExerciseProgresses(response.content);
    });

    REST.getExerciseTypes().then(response => {
      setExerciseTypes(response.content);
    });
  }, []);

  useEffect(() => {
    setExercisesFields(props.exercises)
  }, [props.exercises]);

  function addTraining() {
    REST.addTraining(exercisesFields).then(response => {
      // props.props.history.push('/add-training')
      window.location.reload(false)
    });
  }

  const handleFormChange = (index, event) => {
    let data = [...exercisesFields];
    data[index][event.target.name] = event.target.value;
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
    <React.Fragment>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="div"
          >
            {t('messages.trainingSchema')}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {exercisesFields.map((input, index) => {
            return (
              <div key={index}>
                <FormControl {...styleFormControl} sx={{width: '50px'}}>
                  <Typography display="inline">{index}</Typography>
                </FormControl>
                {!props.isSimpleForm &&
                  <FormControl {...styleFormControl}>
                    <InputLabel id="input-label-type">{t('exercise.type')}</InputLabel>
                    <Select
                      name={t('exercise.type')}
                      placeholder={t('exercise.type')}
                      value={input.type}
                      onChange={event => handleFormChange(index, event)}
                      size='small'
                    >
                      {exerciseTypes ? exerciseTypes.map((exerciseType, index) => {
                        return (
                          <MenuItem key={index} value={exerciseType.type}>
                            {exerciseType.type}
                          </MenuItem>
                        );
                      }) : null}
                    </Select>
                  </FormControl>}
                {!props.isSimpleForm &&
                  <FormControl {...styleFormControl}>
                    <InputLabel id="input-label-place">{t('exercise.place')}</InputLabel>
                    <Select
                      name={t('exercise.place')}
                      placeholder={t('exercise.place')}
                      value={input.place}
                      onChange={event => handleFormChange(index, event)}
                      size='small'
                    >
                      {exercisePlaces ? exercisePlaces.map((exercisePlace, index) => {
                        return (
                          <MenuItem key={index} value={exercisePlace.place}>
                            {exercisePlace.place}
                          </MenuItem>
                        );
                      }) : null}
                    </Select>
                  </FormControl>}
                <FormControl {...styleFormControl} sx={{width: '500px'}}>
                  <InputLabel id="input-label-name">{t('exercise.name')}</InputLabel>
                  <Select
                    name={t('exercise.name')}
                    placeholder={t('exercise.name')}
                    value={input.name}
                    onChange={event => handleFormChange(index, event)}
                    size='small'
                  >
                    {exerciseNames ? exerciseNames.map((exerciseName, index) => {
                      return (
                        <MenuItem key={index} value={exerciseName.name}>
                          {exerciseName.name}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </FormControl>
                <FormControl {...styleFormControl} >
                  <TextField
                    label={t('exercise.reps')}
                    name='reps'
                    placeholder={t('exercise.reps')}
                    value={input.reps}
                    onChange={event => handleFormChange(index, event)}
                    variant="outlined"
                    size="small"
                  />
                </FormControl>
                <FormControl {...styleFormControl} >
                  <TextField
                    sx={{width: '260px'}}
                    label={t('exercise.weight')}
                    name='weight'
                    placeholder={t('exercise.weight')}
                    value={input.weight}
                    onChange={event => handleFormChange(index, event)}
                    variant="outlined"
                    size="small"
                  />
                </FormControl>
                <FormControl {...styleFormControl} sx={{width: '100px'}}>
                  <InputLabel id="input-label-progress">{t('exercise.progress')}</InputLabel>
                  <Select
                    name='progress'
                    placeholder='Progress'
                    value={input.progress}
                    onChange={event => handleFormChange(index, event)}
                    size='small'
                  >
                    {exerciseProgresses ? exerciseProgresses.map((exerciseProgress, index) => {
                      return (
                        <MenuItem key={index} value={exerciseProgress.progress}>
                          {exerciseProgress.progress}
                        </MenuItem>
                      );
                    }) : null}
                  </Select>
                </FormControl>
                <FormControl {...styleFormControl}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => addFields(index)}
                  >
                    {t('messages.add')}
                  </Button>
                </FormControl>
                <FormControl {...styleFormControl}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => removeFields(index)}
                  >
                    {t('messages.remove')}
                  </Button>
                </FormControl>
              </div>
            )
          })}
        </Grid>

        <Grid xs={12}>
          <Button variant="contained" onClick={addTraining}>{t('messages.submit')}</Button>
        </Grid>

      </Grid>
    </React.Fragment>
  )
}