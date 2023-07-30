import React, { useState, useEffect } from 'react';
import REST from '../utils/REST';

import { DataGrid } from '@mui/x-data-grid';
import CenteredContainer from '../component/CenteredContainer';

import { darken, lighten, styled } from '@mui/material/styles';

import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';


export default function FoodStatisticView() {
  const [mealList, setMealList] = useState([]);
  const [mealName, setMealName] = useState('');

  const [mealCategoryList, setMealCategoryList] = React.useState([]);
  const [mealTypeList, setMealTypeList] = React.useState([]);

  const [mealCategory, setMealCategory] = React.useState('All');
  const [mealType, setMealType] = React.useState('All');

  useEffect(() => {
    REST.getMealListByCategory(mealCategory, mealType, mealName).then(response => {
      setMealList(response.entity);
    });

    REST.getMealCategoryList().then(response => {
      setMealCategoryList(response.entity);
    });

    REST.getMealTypeList().then(response => {
      setMealTypeList(response.entity);
    });
  }, []);

  const columns = [
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'kcal', headerName: 'Kcal', type: 'number', width: 100 },
    { field: 'protein', headerName: 'Protein', type: 'number', width: 100 },
    { field: 'carbohydrates', headerName: 'Carbs', type: 'number', width: 100 },
    { field: 'fat', headerName: 'Fat', type: 'number', width: 100 }
  ];

  const handleSelectionModelChange = (selectionModel) => {

    REST.calculateDiet(selectionModel).then(response => {
      console.log(response.entity);
    });

    console.log('Zaznaczone wiersze:', selectionModel);
  };

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

  return (
    <CenteredContainer>
      <Grid container sx={{ width: '70%'}} spacing={2}>
        <Grid>
          <StyledDataGrid
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
        </Grid>
      </Grid>

        
    </CenteredContainer>
  );
}