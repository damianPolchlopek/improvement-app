import React, { useEffect, useState } from 'react';
import REST from '../../utils/REST';
import SingleMeal from './SingleMeal';
import CenteredContainer from '../../component/CenteredContainer';

import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import PropTypes from 'prop-types';


function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
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
  const [mealName, setMealName] = useState('');

  const [mealCategoryList, setMealCategoryList] = React.useState([]);
  const [mealTypeList, setMealTypeList] = React.useState([]);

  const [mealCategory, setMealCategory] = React.useState('All');
  const [mealType, setMealType] = React.useState('All');

  useEffect(() => {
    REST.getMealList(mealCategory, mealType, mealName).then(response => {
      setMealList(response.entity);
    });

    REST.getMealCategoryList().then(response => {
      setMealCategoryList(response.entity);
    });

    REST.getMealTypeList().then(response => {
      setMealTypeList(response.entity);
    });
  }, []);

  const handleMealNameChange = (event) => {
    console.log(event.target.value);
    setMealName(event.target.value);

    filterMeals(mealCategory, mealType, event.target.value);
  };

  const handleMealCategoryChange = (event) => {
    console.log(event.target.value);
    setMealCategory(event.target.value);

    filterMeals(event.target.value, mealType, mealName);
  };

  const handleMealTypeChange = (event) => {
    console.log(event.target.value);
    setMealType(event.target.value);

    filterMeals(mealCategory, event.target.value, mealName);
  };

  const filterMeals = (mealCategory, mealType, mealName) => {
    REST.getMealList(mealCategory, mealType, mealName, 'name').then(response => {
      setMealList(response.entity);
    });
  };

  return (
    <React.Fragment>
      <CenteredContainer>
        <TextField
          sx={{width: '25%'}}
          label="Meal"
          onChange={handleMealNameChange}
        />
      </CenteredContainer>

      <Container style={{minHeight: '10vh', display: 'flex', justifyContent: 'center', width: '25%'}}>
        <FormControl variant="standard" sx={{m: 1, minWidth: 150}}>
          <InputLabel id="demo-simple-select-standard-label">Meal Category</InputLabel>
          {mealCategory ? <Select
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

        <FormControl variant="standard" sx={{m: 1, minWidth: 150}}>
          <InputLabel id="demo-simple-select-standard-label">Meal Type</InputLabel>
          {mealType ? <Select
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

      <CenteredContainer>
        <Grid container rowSpacing={1} columnSpacing={1} sx={{width: '80%'}}>
          {mealList ? mealList.map((meal, index) =>
            <Grid key={index} xs={6}>
              <SingleMeal meal={meal}/>
            </Grid>
          ) : null}
        </Grid>
      </CenteredContainer>
    </React.Fragment>
  );
}