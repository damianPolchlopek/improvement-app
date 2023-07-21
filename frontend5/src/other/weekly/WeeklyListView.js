import React, { useState, useEffect } from 'react';
import REST from '../../utils/REST';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { ExpandLess, ExpandMore }from '@mui/icons-material';
import Typography from '@mui/material/Typography';

import WeeklyAdd from './WeeklyAdd';


export default function WeeklyListView() {
  const [weeklyList, setWeeklyList] = useState([]);
  const [allCategoryTypes, setAllCategoryTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Waga');

  const [isChooseCategoryIsHidden, setIsChooseCategoryIsHidden] = useState(true);
  const [isWeeklyListIsVisible, setIsWeeklyListIsVisible] = useState(false);
    
  useEffect(() => {
    REST.getWeeklyListByCategory(selectedCategory).then(response => {
      setWeeklyList(response.entity);
    });

    REST.getAllCategoryWeeklyRecords().then(response => {
      setAllCategoryTypes(response.entity);
      setSelectedCategory(response.entity[0])
    });

  }, []);

  function loadProductsFromSelectedCategory() {
    REST.getWeeklyListByCategory(selectedCategory).then(response => {
      setWeeklyList(response.entity);
    });
  }

  function deleteProductFromShoppingList(productId) {
    REST.deleteProductFromWeeklyList(productId).then(response => {
      window.location.reload();
    });
  }

  const handleChangeSelectedCategory = (event) => {
    console.log(event.target.value)
    setSelectedCategory(event.target.value);
  };

  return (
    <React.Fragment>
      {allCategoryTypes.length == 1 ? 
      <Grid container spacing={3}>          

          <WeeklyAdd />

          <Grid xs={12}>
            <Typography 
              variant="h5" 
              component="div" 
              onClick={() => setIsChooseCategoryIsHidden(!isChooseCategoryIsHidden)}
            >
              Choose Category
              {isChooseCategoryIsHidden ? <ExpandLess /> : <ExpandMore />}
            </Typography>
          </Grid>
          <Grid xs={12} hidden={isChooseCategoryIsHidden}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={handleChangeSelectedCategory}
              >
                {allCategoryTypes ? allCategoryTypes.map(exerciseType => {
                  return(
                    <MenuItem key={exerciseType} value={exerciseType}>
                      {exerciseType}
                    </MenuItem>
                  );
                }) : null}
              </Select>
            </FormControl>

          {/* style={{textAlign: 'left'}} */}
          <Grid xs={12} hidden={isChooseCategoryIsHidden}>
            <Button 
              variant="contained" 
              onClick={() => {loadProductsFromSelectedCategory()}}
            >
              Load Shopping List
            </Button>
          </Grid>

        </Grid>
        
        
        <Grid xs={12}>
          <Typography 
            variant="h5" 
            component="div"
            onClick={() => setIsWeeklyListIsVisible(!isWeeklyListIsVisible)}
          >
            Weekly Record List
            {isWeeklyListIsVisible ? <ExpandLess /> : <ExpandMore />}
          </Typography>
        </Grid>
        
        {weeklyList.map((product, index) => {
          return <Grid container xs={12} key={index}>
            <Grid xs={4} textAlign='right' hidden={isWeeklyListIsVisible}>
              {product.date}
            </Grid>
            <Grid xs={4} textAlign='left' hidden={isWeeklyListIsVisible}>               
              {product.name}
            </Grid>
            <Grid xs={4} textAlign='left' hidden={isWeeklyListIsVisible}>
              <Button onClick={() => {deleteProductFromShoppingList(product.id)}}>Delete</Button>
            </Grid>
          </Grid>
        })}
          

      </Grid> : null}
    </React.Fragment>
  );
  
}