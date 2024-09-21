import React, { useState } from 'react';
import REST from '../../utils/REST';
import CenteredContainer from '../../component/CenteredContainer';

import {
  Button
} from '@mui/material';

import DaySummary from './MealsDaySummary';
import MealsTable from './MealsTable';

import Grid from '@mui/material/Unstable_Grid2';

export default function AddDietDayView() {
  const [dietSummary, setDietSummary] = useState({kcal: 0, protein: 0, carbohydrates: 0, fat: 0});
  const [selected, setSelected] = React.useState([]);

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleAddMealToDiet = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);

    handleSelectionModelChange(newSelected);
  };

  const handleSelectionModelChange = (selectionModel) => {
    REST.calculateDiet(selectionModel).then(response => {
      setDietSummary(response.entity);
    });
  };

  const addDayDietSummary = () => {
    REST.addDietSummary(selected).then(response => {
      window.location.reload(false)
    });
  };

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
            Save Diet Day
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
