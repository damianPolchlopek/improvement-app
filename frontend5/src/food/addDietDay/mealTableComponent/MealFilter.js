import { MenuItem, Select, Toolbar, Typography } from "@mui/material";
import * as React from "react";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function MealFilter(props) {
  const { t } = useTranslation();

  return (
    <Toolbar>
      <Typography sx={{ marginRight: '20px' }}>
        {t('food.mealPopularity')}
      </Typography>

      <Select
        value={props.mealPopularity}
        onChange={(e) => props.setMealPopularity(e.target.value)}
      >
        <MenuItem value="ALL">{t('food.all')}</MenuItem>
        <MenuItem value="HIGH">{t('food.popular')}</MenuItem>
        <MenuItem value="LOW">{t('food.rare')}</MenuItem>
      </Select>
    </Toolbar>
  );
}

MealFilter.propTypes = {
  mealPopularity: PropTypes.string.isRequired,
  setMealPopularity: PropTypes.func.isRequired
};
