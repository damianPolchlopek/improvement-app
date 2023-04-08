import React from 'react';

import DailyForm from './DailyForm';
import DailyPrintout from './DailyPrintout';

export default function DailyView() {

  return (
    <React.Fragment>
      
      <DailyForm />

      <DailyPrintout />

    </React.Fragment>
  );
  
}