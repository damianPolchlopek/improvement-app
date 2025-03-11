import * as React from 'react';
import {useEffect, useState} from "react";
import REST from "../../utils/REST";
import { useTranslation } from 'react-i18next';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';

import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  Checkbox
} from '@mui/material';


import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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

function translateMealCategory(arg){
  return categoryTranslation.get(arg);
} 

function translateMealPopularity(arg) {
  return popularityTranslation.get(arg);
}

export default function MealTableRow({mealPopularity, mealCategory, ...props}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mealList, setMealList] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    REST.getMealList(translateMealCategory(mealCategory), 'ALL', '',
      translateMealPopularity(mealPopularity), 'category')
      .then(response => {
        setMealList(response.entity);
      })
      .catch(error => {
        console.error("Error fetching meals:", error);
      });
  }, [mealPopularity, mealCategory]);

  return (
    <>
      <StyledTableRow onClick={() => {setIsOpen((open) => !open);}}>
        <StyledTableCell sx={{width: '50px'}} >
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell >
        <StyledTableCell component="th" scope="row">
          {mealCategory}
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
    </>
  );
}