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
    Promise.all([
      REST.getMealCategoryList(),
      REST.getMealTypeList()
    ]).then(([categoryResponse, typeResponse]) => {
      setMealCategoryList(categoryResponse.entity);
      setMealTypeList(typeResponse.entity);
    });
  }, []);

  useEffect(() => {
    REST.getMealList(mealCategory, mealType, mealName, 'ALL', 'name').then(response => {
      setMealList(response.entity);
    });
  }, [mealCategory, mealType, mealName]);

  const handleChange = (event, field) => {
    const value = event.target.value;

    switch(field) {
      case 'mealName':
        setMealName(value);
        break;
      case 'mealCategory':
        setMealCategory(value);
        break;
      case 'mealType':
        setMealType(value);
        break;
      default:
        break;
    }
  };

  const labelIdCategory = "meal-category-select";
  const labelIdType = "meal-type-select";

  return (
    <React.Fragment>
      <CenteredContainer>
        <TextField
          sx={{width: '25%'}}
          label="Meal"
          onChange={(event) => handleChange(event, 'mealName')}
        />
      </CenteredContainer>

      <Container sx={{minHeight: '10vh', display: 'flex', justifyContent: 'center', width: '25%'}}>
        <FormControl variant="standard" sx={{m: 1, minWidth: 150}}>
          <InputLabel id={labelIdCategory}>Meal Category</InputLabel>
            <Select
              labelId={labelIdCategory}
              value={mealCategory}
              onChange={(event) => handleChange(event, 'mealCategory')}
              label="Meal Category"
            >
              {mealCategoryList.map((mealCategory, index) =>
                <MenuItem key={index} value={mealCategory}>{mealCategory}</MenuItem>
              )}
            </Select>
        </FormControl>

        <FormControl variant="standard" sx={{m: 1, minWidth: 150}}>
          <InputLabel id={labelIdType}>Meal Type</InputLabel>
            <Select
              labelId={labelIdType}
              value={mealType}
              onChange={(event) => handleChange(event, 'mealType')}
              label="Meal Type"
            >
              {mealTypeList.map((mealType, index) =>
                <MenuItem key={index} value={mealType}>{mealType}</MenuItem>
              )}
            </Select>
        </FormControl>
      </Container>

      <CenteredContainer>
        <Grid container rowSpacing={1} columnSpacing={1} sx={{width: '80%'}}>
          {mealList.map((meal, index) =>
            <Grid key={index} xs={6}>
              <SingleMeal meal={meal}/>
              {console.log(meal)}
            </Grid>
          )}
        </Grid>
      </CenteredContainer>
    </React.Fragment>
  );
}