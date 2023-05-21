import React from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import CryptoPrices from './CryptoPrices';

export default function FinanceView() {

  return (
    <Grid container rowSpacing={1} columnSpacing={1} style={{
      // alignItems: "center",
      justifyContent: "center",
      height: "100%"
    }}>
      <Grid>
        <CryptoPrices />
      </Grid>

      <Grid>

      </Grid>

      
    </Grid>
  );
}