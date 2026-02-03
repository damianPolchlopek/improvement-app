import React from 'react';
import DailyForm from './DailyForm';
import DailyPrintout from './DailyPrintout';
import CenteredContainer from '../../component/CenteredContainer';

import { Box } from '@mui/material';

export default function DailyView() {
  return (
    <CenteredContainer>
      <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', px: 2 }}>
        <DailyForm />
        <DailyPrintout />
      </Box>
    </CenteredContainer>
  );
}