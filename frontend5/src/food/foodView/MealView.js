import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';
import SingleMeal from './SingleMeal';

import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Container from '@mui/material/Container';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Grid from '@mui/material/Unstable_Grid2';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function MealView() {
  const [mealList, setMealList] = useState([]);

  const [mealCategoryList, setMealCategoryList] = React.useState([]);
  const [mealTypeList, setMealTypeList] = React.useState([]);

  const [mealCategory, setMealCategory] = React.useState('All');
  const [mealType, setMealType] = React.useState('All');
    
  useEffect(() => {
    REST.getMealList().then(response => {
      setMealList(response.entity);
    });

    REST.getMealCategoryList().then(response => {
      setMealCategoryList(response.entity);
    });

    REST.getMealTypeList().then(response => {
      setMealTypeList(response.entity);
    });

  }, []);

  const handleMealCategoryChange = (event) => {
    console.log(event.target.value);
    setMealCategory(event.target.value);

    filterMeals(event.target.value, mealType);
  };

  const handleMealTypeChange = (event) => {
    console.log(event.target.value);
    setMealType(event.target.value);

    filterMeals(mealCategory, event.target.value);
  };

  const filterMeals = (mealCategory, mealType) => {
    REST.getMealList(mealCategory, mealType).then(response => {
      setMealList(response.entity);
    });
  };

  return (
    <React.Fragment>

      <Container style={{minHeight: '10vh', display: 'flex', justifyContent: 'center'}}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="demo-simple-select-standard-label">Meal Category</InputLabel>
          {mealCategory ? 
            <Select
              labelId="demo-simple-select-standard-label"
              value={mealCategory}
              onChange={handleMealCategoryChange}
              label="Meal Category"
              > 
            
              {mealCategoryList ? mealCategoryList.map((mealCategory, index) => 
                <MenuItem key={index} value={mealCategory}>{mealCategory}</MenuItem>
              ) : null}
            </Select>
          : null}
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="demo-simple-select-standard-label">Meal Type</InputLabel>
          
          {mealType ? 
            <Select
              labelId="demo-simple-select-standard-label"
              value={mealType}
              onChange={handleMealTypeChange}
              label="Meal Type"
            >
              {mealTypeList ? mealTypeList.map((mealType, index) =>
                <MenuItem key={index} value={mealType}>{mealType}</MenuItem>
              ) : null}
            </Select>
          : null}
        </FormControl>
      </Container>

      <Grid container rowSpacing={1} columnSpacing={1}>
        {mealList ? mealList.map((meal, index) => 
          <Grid key={index} xs={6}>
            <SingleMeal meal={meal} />
          </Grid>
          ) 
        : null}
      </Grid>
    </React.Fragment>
  );
}