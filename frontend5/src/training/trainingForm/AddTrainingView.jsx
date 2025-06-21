import React, { useState } from "react";
import REST from '../../utils/REST';
import TrainingForm from "./TrainingForm";
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

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
  const [isSimpleForm, setIsSimpleForm] = useState(true);
  const [trainingType, setTrainingType] = useState('A'); // na starcie brak
  const [shouldFetch, setShouldFetch] = useState(false); // trigger zapytania
  const { t } = useTranslation();

  const {
    data: exercises,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['training-template', trainingType],
    queryFn: () => REST.getTrainingTemplateByType(trainingType),
    // enabled: shouldFetch, // tylko jeśli kliknięto
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    onSuccess: () => {
      setShouldFetch(false); // wyłącz trigger po pobraniu
    },
  });

  const handleLoadTraining = () => {
    setShouldFetch(true)
  };

  return (
    <Grid container spacing={2} sx={{ minWidth: 200 }}>
      <Grid item xs={12}>
        <Typography variant="h5">{t('messages.loadLastTraining')}</Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <TrainingTypeSelector setTrainingType={setTrainingType} />
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleLoadTraining}
          disabled={!trainingType || isFetching}
        >
          {isFetching ? t('messages.loading') || 'Ładowanie...' : t('messages.loadLastTraining')}
        </Button>
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox />}
          label={t('messages.enableMoreAccurateForm')}
          onClick={() => setIsSimpleForm(!isSimpleForm)}
        />
      </Grid>

      <Grid item xs={12}>
        {isError && (
          <Typography color="error">
            {t('messages.errorLoadingTraining') || 'Błąd podczas ładowania'}: {error.message}
          </Typography>
        )}

        <TrainingForm
          isSimpleForm={isSimpleForm}
          exercises={exercises?.content || []}
        />
      </Grid>
    </Grid>
  );
}
