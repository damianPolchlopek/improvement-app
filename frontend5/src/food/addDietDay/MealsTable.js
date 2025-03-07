import * as React from 'react';
import {useEffect, useState} from "react";
import REST from "../../utils/REST";
import { useTranslation } from 'react-i18next';

import MealFilter from "./mealTableComponent/MealFilter";
import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';

import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Checkbox
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {
  const { row } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [mealList, setMealList] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!mealList.length) {
      refreshMeals();
    }
  }, []);

  const refreshMeals = () => {
    REST.getMealList(translateMealCategory(row), 'ALL', '',
      translateMealPopularity(props.mealPopularity), 'category')
      .then(response => {
        setMealList(response.entity);
      })
      .catch(error => {
        console.error("Error fetching meals:", error);
      });
  };

  const categoryTranslation = new Map([
    ['ALL', 'All'],
    ['LUNCH', 'Obiad'],
    ['BREAKFAST', 'Śniadanie'],
    ['HOT_DISH', 'Ciepły Posiłek'],
    ['SWEETS', 'Słodycze'],
    ['DINNER', 'Kolacja'],
  ]);

  const popularityTranslation = new Map([
    ['ALL', 'All'],
    ['HIGH', 'Wysoka'],
    ['LOW', 'Niska'],
  ]);

  const translateMealCategory = (arg) => categoryTranslation.get(arg);
  const translateMealPopularity = (arg) => popularityTranslation.get(arg);

  return (
    <React.Fragment>
      <StyledTableRow onClick={() => {refreshMeals(); setIsOpen((open) => !open);}}>
        <StyledTableCell sx={{width: '50px'}} >
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell >
        <StyledTableCell component="th" scope="row">
          {row}
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={isOpen}
            timeout="auto"
            unmountOnExit
          >
            <Table size="small">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell>{t('food.name')}</StyledTableCell>
                  <StyledTableCell>{t('food.kcal')}</StyledTableCell>
                  <StyledTableCell>{t('food.protein')}</StyledTableCell>
                  <StyledTableCell>{t('food.carbs')}</StyledTableCell>
                  <StyledTableCell>{t('food.fat')}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {mealList.map((meal) => {
                  const isItemSelected = props.isSelected(meal.id);

                  return (
                    <StyledTableRow
                      onClick={(event) => props.handleClick(event, meal.id)}
                      key={meal.name}
                      selected={isItemSelected}
                    >
                      <StyledTableCell>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                        />
                      </StyledTableCell>
                      <StyledTableCell>{meal.name}</StyledTableCell>
                      <StyledTableCell>{meal.kcal}</StyledTableCell>
                      <StyledTableCell>{meal.protein}</StyledTableCell>
                      <StyledTableCell>{meal.carbohydrates}</StyledTableCell>
                      <StyledTableCell>{meal.fat}</StyledTableCell>
                    </StyledTableRow>
                )})}
              </TableBody>
            </Table>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}

export default function MealsTable(props) {
  const [mealPopularity, setMealPopularity] = useState('HIGH');
  const { t } = useTranslation();

  const rows = [
    t('food.breakfast'),
    t('food.lunch'),
    t('food.hotDish'),
    t('food.dinner'),
    t('food.sweets'),
    t('food.other')
  ];

  return (
    <Paper sx={{ minWidth: 700 }}>
      <MealFilter
        mealPopularity={mealPopularity}
        setMealPopularity={setMealPopularity}
      />
      <TableContainer>
        <Table aria-label="collapsible table" sx={{ minWidth: 700 }}>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row}
                row={row}
                sx={{textAlign: 'left'}}
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