import React from 'react';
import REST from '../utils/REST';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

function HomeView() {
  return (
    <Grid container rowSpacing={1} columnSpacing={1}>

      <Grid xs={6}>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => REST.initTrainingModule()}
        >
          Init Training Module
        </Button>
      </Grid>
      <Grid xs={6}>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => REST.initFoodModule()}
        >
          Init Food Module
        </Button>
      </Grid>
      
    </Grid>

  );
}

export default HomeView;
