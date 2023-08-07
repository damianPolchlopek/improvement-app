import React, { useState, useEffect, memo } from 'react';
import REST from '../utils/REST';

import { DataGrid } from '@mui/x-data-grid';
import CenteredContainer from '../component/CenteredContainer';

import { darken, lighten, styled } from '@mui/material/styles';

import { Typography, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';


export default function FoodStatisticView() {
  const [mealList, setMealList] = useState([]);
  const [dietSummary, setDietSummary] = useState({kcal: 0, protein: 0, carbohydrates: 0, fat: 0});

  useEffect(() => {
    REST.getMealList('All', 'All', '', 'category').then(response => {
      setMealList(response.entity);
    });
  }, []);

  const handleSelectionModelChange = (selectionModel) => {
    REST.calculateDiet(selectionModel).then(response => {
      setDietSummary(response.entity);
    });
  };

  const addDayDietSummary = () => {
    REST.addDietSummary(dietSummary).then(response => {
      console.log('dodalem: ' + response.entity);
      window.location.reload(false)
    });
  };

  return (
    <CenteredContainer>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography>
            Kcal: {dietSummary.kcal} Protein: {dietSummary.protein} Carbs: {dietSummary.carbohydrates} Fat: {dietSummary.fat}
          </Typography>
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
          <MealTable 
            mealList={mealList} 
            handleSelectionModelChange={handleSelectionModelChange} />
        </Grid>
      </Grid>

    </CenteredContainer>
  );
}

const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .super-app-theme--BREAKFAST': {
    backgroundColor: getBackgroundColor(theme.palette.info.main, theme.palette.mode),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode,
        ),
      },
    },
  },
  '& .super-app-theme--LUNCH': {
    backgroundColor: getBackgroundColor(
      theme.palette.success.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode,
        ),
      },
    },
  },
  '& .super-app-theme--HOT_DISH': {
    backgroundColor: getBackgroundColor(
      theme.palette.warning.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode,
        ),
      },
    },
  },
  '& .super-app-theme--DINNER': {
    backgroundColor: getBackgroundColor(
      theme.palette.error.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
      },
    },
  },
}));

const MealTable = memo(function MealTable({mealList, handleSelectionModelChange }) {
  const columns = [
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'kcal', headerName: 'Kcal', type: 'number', width: 100 },
    { field: 'protein', headerName: 'Protein', type: 'number', width: 100 },
    { field: 'carbohydrates', headerName: 'Carbs', type: 'number', width: 100 },
    { field: 'fat', headerName: 'Fat', type: 'number', width: 100 }
  ];

  return <StyledDataGrid
            rows={mealList}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 15 },
              },
            }}
            pageSizeOptions={[0, 5, 10, 15]}
            onRowSelectionModelChange={handleSelectionModelChange}
            getRowClassName={(params) => `super-app-theme--${params.row.category}`}
            checkboxSelection
          />
})
