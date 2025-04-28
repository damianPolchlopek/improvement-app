import React, { useState } from 'react';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Button,
  CircularProgress
} from '@mui/material';

import DietDaySummaryForm from '../component/dietSummaryForm/DietDaySummaryForm';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../utils/REST';
import { useSnackbar } from '../../component/SnackbarProvider';

export default function AddDietDayView() {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
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
      showSnackbar( t('food.failedAddDietSummary'), 'error' );
    }
  });

  const handleSave = () => {
    const dietDayToSave = { meals: selected };
    createDietSummaryMutation.mutate(dietDayToSave);
  };

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
    </>
  );
}