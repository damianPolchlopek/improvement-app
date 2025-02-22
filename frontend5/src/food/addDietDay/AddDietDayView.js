import React, { useState } from 'react';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';
import { useTranslation } from 'react-i18next';

import {
  Button
} from '@mui/material';

import DaySummary from './MealsDaySummary';
import MealsTable from './MealsTable';

import Grid from '@mui/material/Unstable_Grid2';

export default function AddDietDayView() {
  const [dietSummary, setDietSummary] = useState({kcal: 0, protein: 0, carbohydrates: 0, fat: 0});
  const [selected, setSelected] = React.useState([]);
  const { t } = useTranslation();

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleAddMealToDiet = React.useCallback((event, id) => {
    const newSelected = new Set(selected);

    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }

    const newSelectedArray = Array.from(newSelected);
    setSelected(newSelectedArray);

    handleSelectionModelChange(newSelectedArray);
  }, [selected]);

  const handleSelectionModelChange = (selectionModel) => {
    REST.calculateDiet(selectionModel)
      .then(response => {
        setDietSummary(response.entity);
      })
      .catch(error => {
        console.error("Error calculating diet:", error);
      });
  };

  const addDayDietSummary = React.useCallback(() => {
    REST.addDietSummary(selected)
      .then(response => {
        window.location.reload(false);
      })
      .catch(error => {
        console.error("Error adding diet summary:", error);
      });
  }, [selected]);

  return (
    <CenteredContainer>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <DaySummary dietSummary={dietSummary} />
        </Grid>

        <Grid xs={12}>
          <Button
            variant="contained"
            onClick={addDayDietSummary}
          >
            {t('addDietDay.saveDietDay')}
          </Button>
        </Grid>

        <Grid xs={12}>
          <MealsTable
            isSelected={isSelected}
            handleClick={handleAddMealToDiet}
          />
        </Grid>

      </Grid>

    </CenteredContainer>
  );
}
