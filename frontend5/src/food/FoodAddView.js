import React, { useEffect, useState } from 'react';
import REST from '../utils/REST';
import CenteredContainer from '../component/CenteredContainer';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

export default function FoodAddView() {
  const [mealList, setMealList] = useState([]);
  const [mealIngredient, setMealIngredient] = useState([]);

  useEffect(() => {
    REST.getMealList('All', 'All', '', 'category').then(response => {
      setMealList(response.entity);
    });
  }, []);

  const inputChange = (e, index) => {
    mealList[index].amount = parseInt(e.target.value);
  }

  const calculateIngredients = () => {
    REST.checkProduct(mealList).then(response => {
      setMealIngredient(response.entity)
    })
  }

  return (
    <CenteredContainer>

      <Grid container spacing={2} style={{width: '70%'}}>
        <Grid xs={12}>
          <Button
            variant="contained"
            onClick={calculateIngredients}
          >
            Calculate Ingredients
          </Button>
        </Grid>

        <Grid xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Kcal</TableCell>
                  <TableCell>Protein</TableCell>
                  <TableCell>Carbs</TableCell>
                  <TableCell>Fat</TableCell>
                  <TableCell>Portion</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {mealList.map((meal, index) => {
                  return <TableRow key={index}>
                    <TableCell>{meal.name}</TableCell>
                    <TableCell>{meal.category}</TableCell>
                    <TableCell>{meal.kcal}</TableCell>
                    <TableCell>{meal.protein}</TableCell>
                    <TableCell>{meal.carbohydrates}</TableCell>
                    <TableCell>{meal.fat}</TableCell>
                    <TableCell>{meal.portionAmount}</TableCell>
                    <TableCell>
                      <input
                        defaultValue={meal.amount}
                        onChange={(e) => inputChange(e, index)}
                      />
                    </TableCell>
                  </TableRow>
                })}

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid xs={12}>
          Ingredients:
        </Grid>

        <Grid xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Unit</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {mealIngredient.map((meal, index) => {
                  return <TableRow key={index}>
                    <TableCell>{meal.name}</TableCell>
                    <TableCell>{meal.amount}</TableCell>
                    <TableCell>{meal.unit}</TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

    </CenteredContainer>
  );
}