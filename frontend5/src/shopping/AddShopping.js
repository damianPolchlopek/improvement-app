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

export default function AddShopping() {
  const [allCategoryTypes, setAllCategoryTypes] = useState([]);
  const [item, setItem] = useState({name: '', category: 'SklepSpożywczy'});
    
  useEffect(() => {

    REST.getAllCategoryProducts().then(response => {
      setAllCategoryTypes(response.entity);
    });

  }, []);

  function addProductToShoppingList(){
    REST.addProductToShoppingList(item).then(response => {
      window.location.reload();
    });
  }

  return (
    <React.Fragment>
      {allCategoryTypes.length > 3 ? 
      <React.Fragment>

        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography 
              variant="h5" 
              component="div" 
            >
              Add Products
            </Typography>
          </Grid>

          <Grid xs={12}>
            <TextField
              placeholder="Product Name ..."
              label="Name"
              variant="outlined"
              size="small"
              onChange={(e)=> setItem({name: e.target.value, category: item.category})}
              // style={{color: 'white'}}
            />
          </Grid>
          

          <Grid xs={12}>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                defaultValue={allCategoryTypes[0]} 
                onChange={(e)=> setItem({name: item.name, category: e.target.value})}
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
            
          <Grid xs={12}>
            <Button 
              variant="contained" 
              onClick={() => addProductToShoppingList()}
            >
              Add Product
            </Button>
          </Grid>

        </Grid>

      </React.Fragment> : null}
    </React.Fragment>
  );
  
}