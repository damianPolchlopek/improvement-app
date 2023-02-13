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

import moment from 'moment';

function formatXAxis(tickItem) {
  return moment(tickItem).format('DD-MM-YYYY')
}

export default function AddShopping() {
  const [allCategoryTypes, setAllCategoryTypes] = useState([]);
  const [item, setItem] = useState({name: '', category: 'Waga'});
  const [isAddProductIsVisible, setIsAddProductIsVisible] = useState(false);
    
  useEffect(() => {

    REST.getAllCategoryWeeklyRecords().then(response => {
      setAllCategoryTypes(response.entity);
    });

  }, []);

  function addProductToShoppingList(){
    REST.addProductToWeeklyList(item).then(response => {
      console.log(item)
      window.location.reload();
    });
  }

  return (
    <React.Fragment>
      {allCategoryTypes.length > 0 ? 
      <React.Fragment>

        <Grid container spacing={2} xs={12}>
          <Grid xs={12}>
            <Typography 
              variant="h5" 
              component="div" 
              onClick={() => setIsAddProductIsVisible(!isAddProductIsVisible)}
            >
              Add Weekly Records
              {!isAddProductIsVisible ? <ExpandLess /> : <ExpandMore />}
            </Typography>
          </Grid>

          <Grid xs={12} hidden={isAddProductIsVisible}>
            <TextField
              placeholder="Item ..."
              label="Weekly Record"
              variant="outlined"
              size="small"
              onChange={(e)=> setItem({name: e.target.value, date: formatXAxis(moment().valueOf()), category: item.category})}
            />
          </Grid>
          

          <Grid xs={12} hidden={isAddProductIsVisible}>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                defaultValue={allCategoryTypes[0]} 
                onChange={(e)=> setItem({name: item.name,  date: formatXAxis(moment().valueOf()), category: e.target.value})}
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
              Add Weekly Record
            </Button>
          </Grid>

        </Grid>

      </React.Fragment> : null}
    </React.Fragment>
  );
  
}