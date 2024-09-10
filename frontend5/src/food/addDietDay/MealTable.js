import * as React from 'react';
import {useEffect, useState} from "react";
import REST from "../../utils/REST";

import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox, Typography, Toolbar, MenuItem, Select
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [mealList, setMealList] = useState([]);

  useEffect(() => {
    refreshMeals();
  }, []);

  const refreshMeals = () => {
    REST.getMealList(translateFunction(row), 'ALL', '', props.mealPopularity, 'category')
      .then(response => {
        setMealList(response.entity);
      });
  }

  const translateFunction = (arg) => {
    const categoryTranslation = new Map([
      ['ALL', 'All'],
      ['LUNCH', 'Obiad'],
      ['BREAKFAST', 'Śniadanie'],
      ['HOT_DISH', 'Ciepły Posiłek'],
      ['DINNER', 'Kolacja'],
    ]);

    return categoryTranslation.get(arg);
  }

  return (
    <React.Fragment>
      <TableRow onClick={() => {refreshMeals(); setOpen(!open);}}>
        <TableCell sx={{width: '50px'}} >
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell >
        <TableCell component="th" scope="row">
          {row}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Kcal</TableCell>
                  <TableCell>Protein</TableCell>
                  <TableCell>Carbs</TableCell>
                  <TableCell>Fat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mealList.map((meal) => {
                  const isItemSelected = props.isSelected(meal.id);

                  return (
                    <TableRow
                      onClick={(event) => props.handleClick(event, meal.id)}
                      key={meal.name}
                      selected={isItemSelected}
                    >
                      <TableCell>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                        />
                      </TableCell>
                      <TableCell>{meal.name}</TableCell>
                      <TableCell>{meal.kcal}</TableCell>
                      <TableCell>{meal.protein}</TableCell>
                      <TableCell>{meal.carbohydrates}</TableCell>
                      <TableCell>{meal.fat}</TableCell>
                    </TableRow>
                )})}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  'BREAKFAST',
  'LUNCH',
  'HOT_DISH',
  'DINNER',
  'OTHER'
];

function MyToolbar(props) {

  return (
    <Toolbar>
        <Typography
          sx={{ align: 'left' }}
        >
          Meal Popularity
        </Typography>

      <Select
        onChange={(e => props.setMealPopularity(e.target.value))}
        defaultValue="HIGH"
      >
        <MenuItem value="ALL">ALL</MenuItem>
        <MenuItem value="HIGH">Popular</MenuItem>
        <MenuItem value="LOW">Rare</MenuItem>
      </Select>
    </Toolbar>
  );
}

export default function MealTable(props) {
  const [mealPopularity, setMealPopularity] = React.useState('HIGH');

  return (
    <Paper style={{ minWidth: '700px' }}>
      <MyToolbar
        mealPopularity={mealPopularity}
        setMealPopularity={setMealPopularity}
      />
      <TableContainer>
        <Table aria-label="collapsible table" style={{ minWidth: '700px' }}>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row}
                row={row}
                style={{textAlign: 'left'}}
                isSelected={props.isSelected}
                handleClick={props.handleClick}
                mealPopularity={mealPopularity}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}