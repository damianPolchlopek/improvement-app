import { Typography } from "@mui/material";
import CenteredContainer from "../../../component/CenteredContainer";
import PropTypes from "prop-types";
import { useTranslation } from 'react-i18next';
import { formatInput } from '../../../utils/common';

export default function MealsDaySummary({ dietSummary }) {
  const { t } = useTranslation();

  if (!dietSummary) return null;

  const { kcal, protein, carbohydrates, fat } = dietSummary;

  return (
    <CenteredContainer>
      <Typography sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <span>{t('food.kcal')}: {formatInput(kcal)}</span>
        <span>{t('food.protein')}: {formatInput(protein)}</span>
        <span>{t('food.carbs')}: {formatInput(carbohydrates)}</span>
        <span>{t('food.fat')}: {formatInput(fat)}</span>
      </Typography>
    </CenteredContainer>
  );
}

MealsDaySummary.propTypes = {
  dietSummary: PropTypes.shape({
    kcal: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    carbohydrates: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
  }).isRequired,
};
