import React, { useState, useEffect } from 'react';
import REST from '../utils/REST';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { ExpandLess, ExpandMore }from '@mui/icons-material';


export default function ShoppingListView() {
  const [shoppingList, setShoppingList] = useState([]);
  const [allCategoryTypes, setAllCategoryTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [item, setItem] = useState({name: '', category: 'SklepSpożywczy'});

  const [isAddProductIsVisible, setIsAddProductIsVisible] = useState(false);
  const [isChooseCategoryIsHidden, setIsChooseCategoryIsHidden] = useState(true);
  const [isShoppingListIsVisible, setIsShoppingListIsVisible] = useState(false);
    
  useEffect(() => {
    REST.getShoppingList().then(response => {
        setShoppingList(response.entity);
    });

    REST.getAllCategoryProducts().then(response => {
      setAllCategoryTypes(response.entity);
      setSelectedCategory(response.entity[1])
    });

  }, []);

  function loadProductsFromSelectedCategory(){
    REST.getShoppingListByCategory(selectedCategory).then(response => {
      setShoppingList(response.entity);
    });
  }

  function deleteProductFromShoppingList(productId){
    REST.deleteProductFromShoppingList(productId).then(response => {
      window.location.reload();
    });
  }

  function addProductToShoppingList(){
    REST.addProductToShoppingList(item).then(response => {
      window.location.reload();
    });
  }

  const handleChangeSelectedCategory = (event) => {
    console.log(event.target.value)
    setSelectedCategory(event.target.value);
  };

  return (
    <React.Fragment>
      {allCategoryTypes.length > 3 ? 
      <React.Fragment>
       
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography 
              variant="h5" 
              component="div" 
              onClick={() => setIsAddProductIsVisible(!isAddProductIsVisible)}
            >
              Add Products
              {!isAddProductIsVisible ? <ExpandLess /> : <ExpandMore />}
            </Typography>
          </Grid>

          <Grid xs={12} hidden={isAddProductIsVisible}>
            <TextField
              placeholder="Product Name ..."
              label="Name"
              variant="outlined"
              size="small"
              onChange={(e)=> setItem({name: e.target.value, category: item.category})}
              // style={{color: 'white'}}
            />
          </Grid>
          

          <Grid xs={12} hidden={isAddProductIsVisible}>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                defaultValue={allCategoryTypes[0]} 
                onChange={(e)=> setItem({name: item.name, category: e.target.value})}
                label="Category"
                size="small"
              >
                {allCategoryTypes ? allCategoryTypes.map(categoryType => {
                  return(
                    <MenuItem key={categoryType} value={categoryType}>
                      {categoryType}
                    </MenuItem>
                  );
                }) : null}
              </Select>
            </FormControl>
          </Grid>
            
          <Grid xs={12} hidden={isAddProductIsVisible}>
            <Button 
              variant="contained" 
              onClick={() => addProductToShoppingList()}
            >
              Add Product
            </Button>
          </Grid>

        </Grid>

        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography 
              variant="h5" 
              component="div" 
              onClick={() => setIsChooseCategoryIsHidden(!isChooseCategoryIsHidden)}
            >
              Choose Category
              {!isChooseCategoryIsHidden ? <ExpandLess /> : <ExpandMore />}
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
          </Grid>

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
        
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography 
              variant="h5" 
              component="div"
              onClick={() => setIsShoppingListIsVisible(!isShoppingListIsVisible)}
            >
              Shopping List
              {!isShoppingListIsVisible ? <ExpandLess /> : <ExpandMore />}
            </Typography>
          </Grid>
          
          {shoppingList.map((product, index) => {
            return <Grid container xs={12} key={index}>
              <Grid xs={6} textAlign='right' hidden={isShoppingListIsVisible}>
                {product.name}
              </Grid>
              <Grid xs={6} textAlign='left' hidden={isShoppingListIsVisible}>
                <Button onClick={() => {deleteProductFromShoppingList(product.id)}}>Delete</Button>
              </Grid>
            </Grid>
          })}
          
        </Grid>

      </React.Fragment> : null}
    </React.Fragment>
  );
  
}