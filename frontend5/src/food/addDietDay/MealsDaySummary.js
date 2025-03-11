import { Typography } from "@mui/material";
import React from "react";
import CenteredContainer from "../../component/CenteredContainer";
import PropTypes from "prop-types";
import { useTranslation } from 'react-i18next';

export default function FoodStatisticView({ dietSummary }) {
  const { t } = useTranslation();

  if (!dietSummary) return null;

  const { kcal, protein, carbohydrates, fat } = dietSummary;

  return (
    <CenteredContainer>
      <Typography>
        {t('food.kcal')}: {kcal} {t('food.protein')}: {protein} {t('food.carbs')}: {carbohydrates} {t('food.fat')}: {fat}
      </Typography>
    </CenteredContainer>
  );
}

FoodStatisticView.propTypes = {
  dietSummary: PropTypes.shape({
    kcal: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    carbohydrates: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
  }).isRequired,
};
