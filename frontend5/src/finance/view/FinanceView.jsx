import React from 'react';

import CryptoPrices from './CryptoPrices';
import CenteredContainer from '../../component/CenteredContainer';

export default function FinanceView() {

  return (
    <CenteredContainer>
      <CryptoPrices />  
    </CenteredContainer>
  );
}