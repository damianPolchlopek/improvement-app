import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Collapse,
  Table,
  TableBody,
  TableHead,
  CircularProgress
} from '@mui/material';
import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';
import MealRow from './MealRow';

export default function MealsList({ 
  isOpen, 
  mealList, 
  isLoading, 
  isError 
}) {
  const { t } = useTranslation();

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableBody>
          <StyledTableRow>
            <StyledTableCell colSpan={8} align="center">
              <CircularProgress />
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      );
    }

    if (isError) {
      return (
        <TableBody>
          <StyledTableRow>
            <StyledTableCell colSpan={8} align="center">
              {t('food.errorLoadingMeals')}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {mealList.map((meal, index) => (
          <MealRow 
            key={meal.id || index} 
            meal={meal} 
            index={index} 
          />
        ))}
      </TableBody>
    );
  };

  return (
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
                <StyledTableCell padding="checkbox"></StyledTableCell>
                <StyledTableCell>{t('food.name')}</StyledTableCell>
                <StyledTableCell>{t('food.kcal')}</StyledTableCell>
                <StyledTableCell>{t('food.protein')}</StyledTableCell>
                <StyledTableCell>{t('food.carbs')}</StyledTableCell>
                <StyledTableCell>{t('food.fat')}</StyledTableCell>
                <StyledTableCell>{t('food.amount')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            {renderContent()}
          </Table>
        </Collapse>
      </StyledTableCell>
    </StyledTableRow>
  );
}