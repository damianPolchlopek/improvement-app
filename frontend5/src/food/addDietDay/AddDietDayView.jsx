import React, { useState } from 'react';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Button,
  CircularProgress
} from '@mui/material';

import Snackbar from '../../component/Snackbar';
import DietDaySummaryForm from '../component/dietSummaryForm/DietDaySummaryForm';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../utils/REST';

export default function AddDietDayView() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { t } = useTranslation();
  const navigate = useNavigate();

  // setSelect obecnie jest w Komponencie glownym i podrzednym - niezbyt dobra implementacja
  // do pomyslenia jak to bedzie mozna zrobic lepiej
  const [selected, setSelected] = useState([]);

  const createDietSummaryMutation = useMutation({
    mutationFn: (selectedIds) => REST.createDietSummary(selectedIds),
    onSuccess: () => {
      queryClient.invalidateQueries(['diet-summaries']);
      navigate('/food/statistics');
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: t('food.failedAddDietSummary'),
        severity: 'error',
      });
    }
  });

  const handleSave = () => {
    const dietDayToSave = { meals: selected };
    createDietSummaryMutation.mutate(dietDayToSave);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  }

  return (
    selected && <>
      <DietDaySummaryForm 
        initialSelected={selected}
        onSelectionChange={setSelected}
      >
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={createDietSummaryMutation.isLoading}
          startIcon={
            createDietSummaryMutation.isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : null
          }
        >
          {t('food.saveDietDay')}
        </Button>
      </DietDaySummaryForm>

      <Snackbar
        open={snackbar.open}
        severity={snackbar.severity} 
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </>
  );
}