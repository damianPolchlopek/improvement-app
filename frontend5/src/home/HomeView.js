import React from 'react';
import REST from '../utils/REST';

import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';

function HomeView() {
  const [loadingTrainingModule, setLoadingTrainingModule] = React.useState(false);
  const [loadingFoodModule, setLoadingFoodModule] = React.useState(false);
  const { t } = useTranslation();

  function handleClickTrainingModule() {
    setLoadingTrainingModule(true);
    REST.initTrainingModule().then(response => {
      setLoadingTrainingModule(false);
    })
  }

  function handleClickFoodModule() {
    setLoadingFoodModule(true);
    REST.initFoodModule().then(response => {
      setLoadingFoodModule(false);
    })
  }

  return (
    <Grid container rowSpacing={1} columnSpacing={1}>
      <Grid xs={6}>
        <LoadingButton
          size="large"
          onClick={handleClickTrainingModule}
          loading={loadingTrainingModule}
          variant="outlined"
        >
          {t('home.initTrainingModule')}
        </LoadingButton>
      </Grid>
      <Grid xs={6}>
        <LoadingButton
          variant="outlined"
          size="large"
          onClick={handleClickFoodModule}
          loading={loadingFoodModule}
        >
          {t('home.initFoodModule')}
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

export default HomeView;
