import React from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import REST from '../../../utils/REST';
import { useTranslation } from 'react-i18next';
import { Box, Collapse, Skeleton, Table, TableBody, TableHead } from '@mui/material';
import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';
import MealRow from './MealRow';
import { HAIRLINE } from '../../../tokens';

const popularityTranslation = new Map([
  ['ALL', 'All'],
  ['HIGH', 'Wysoka'],
  ['LOW', 'Niska'],
]);

function translateMealPopularity(arg) {
  return popularityTranslation.get(arg) ?? 'ALL';
}

export default function MealsList({ isOpen, mealCategory, mealPopularity, searchTerm = '' }) {
  const { t } = useTranslation();

  const {
    data: mealList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['mealList', mealCategory, mealPopularity, searchTerm],
    queryFn: () =>
      REST.getMealList(
        mealCategory,
        'ALL',
        searchTerm,
        translateMealPopularity(mealPopularity),
        'category',
        true
      ),

    enabled: !!mealCategory && !!mealPopularity && isOpen,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // cache data for 10 minutes
  });

  if (isLoading) {
    return (
      <StyledTableRow>
        <StyledTableCell colSpan={2} sx={{ px: 2 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={36} />
          ))}
        </StyledTableCell>
      </StyledTableRow>
    );
  }

  if (isError) {
    return (
      <StyledTableRow>
        <StyledTableCell colSpan={2} align="center">
          {t('food.errorLoadingMeals')}
        </StyledTableCell>
      </StyledTableRow>
    );
  }

  return (
    <StyledTableRow>
      <StyledTableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mx: { xs: 0, md: 2 },
              mb: 2,
              borderRadius: 2,
              border: HAIRLINE,
              bgcolor: 'surface.inset',
              overflow: 'hidden',
            }}
          >
            <Table size="small">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell padding="checkbox"></StyledTableCell>
                  <StyledTableCell>{t('food.name')}</StyledTableCell>
                  <StyledTableCell align="right">{t('food.kcal')}</StyledTableCell>
                  <StyledTableCell align="right">{t('food.protein')}</StyledTableCell>
                  <StyledTableCell align="right">{t('food.carbs')}</StyledTableCell>
                  <StyledTableCell align="right">{t('food.fat')}</StyledTableCell>
                  <StyledTableCell align="right">{t('food.amount')}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {mealList.length === 0 ? (
                  <StyledTableRow>
                    <StyledTableCell colSpan={8} align="center">
                      {t('food.noMealsFound')}
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  mealList.map((meal, index) => (
                    <MealRow
                      key={meal.id || index}
                      meal={{ ...meal, mealCategory }}
                      index={index}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </StyledTableCell>
    </StyledTableRow>
  );
}
