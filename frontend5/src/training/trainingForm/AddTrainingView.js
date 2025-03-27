import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import REST from '../../utils/REST';
import TrainingForm from "./TrainingForm";
import { useTranslation } from 'react-i18next';

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
} from "@mui/material";

import Grid from '@mui/material/Unstable_Grid2';
import TrainingTypeSelector from "../component/TrainingTypeSelector";


export default function AddTrainingView() {
  const [exercises, setExercises] = useState([]);
  const [isSimpleForm, setIsSimpleForm] = useState(true);
  const [trainingType, setTrainingType] = useState('A');
  const { t } = useTranslation();
  const navigate = useNavigate();

  function loadLastTraining() {
    REST.getTrainingTemplateByType(trainingType)
    .then(response => {
      setExercises(response.content);
    })
    .catch(error => console.error("Error loading training:", error));
  }

  function addTraining() {
    REST.addTraining(exercises)
    .then(response => {
      navigate('/training/add')
    })
    .catch(error => console.error("Error adding training:", error));
  }

  return (
    <>
      <Grid container spacing={2} sx={{ minWidth: 200 }}>
        <Grid item xs={12} sx={{ minWidth: 200 }}>
          <Typography
            variant="h5"
            component="div"
          >
            {t('messages.loadLastTraining')}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ minWidth: 200 }}>
          <FormControl sx={{m: 1, minWidth: 120}}>
            <TrainingTypeSelector 
              setTrainingType={setTrainingType}
            />
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sx={{ minWidth: 200 }}>
          <Button
            variant="contained"
            onClick={() => loadLastTraining()}
          >
            {t('messages.loadLastTraining')}
          </Button>
        </Grid>

        <Grid item xs={12} sx={{ minWidth: 200 }}>
          <FormControlLabel
            control={<Checkbox/>}
            label={t('messages.enableMoreAccurateForm')}
            onClick={() => {
              setIsSimpleForm(!isSimpleForm)
            }}
          />
        </Grid>

        <Grid item xs={12} sx={{ minWidth: 200 }} />
        <Grid item xs={12} sx={{ minWidth: 200 }} />
        <Grid item xs={12} sx={{ minWidth: 200 }} />

        <Grid item xs={12} sx={{ minWidth: 200 }}>
          <TrainingForm
            isSimpleForm={isSimpleForm}
            exercises={exercises}
            submitFunction={addTraining}/>
        </Grid>

      </Grid>
    </>

  );
}
