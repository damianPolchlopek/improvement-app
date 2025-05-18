import { Typography } from "@mui/material";
import CenteredContainer from "../../../component/CenteredContainer";
import { useTranslation } from 'react-i18next';
import { formatInput } from '../../../utils/common';
import { useMealSelection } from '../../../context/MealSelectionContext';

export default function MealsDaySummary() {
  const { t } = useTranslation();
  const { dietSummary } = useMealSelection();

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