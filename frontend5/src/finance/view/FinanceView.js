import React from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import CryptoPrices from './CryptoPrices';
import CenteredContainer from '../../component/CenteredContainer';

export default function FinanceView() {

  return (
    <CenteredContainer>
      <CryptoPrices />  
    </CenteredContainer>
  );
}