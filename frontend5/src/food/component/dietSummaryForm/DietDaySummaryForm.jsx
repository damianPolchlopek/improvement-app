import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MealsTable from './MealsTable';
import MealsDaySummary from './MealsDaySummary';
import FoodPageHeader from '../FoodPageHeader';
import { useMealSelection } from '../../../context/MealSelectionContext';

// Wspólny układ widoków dodawania i edycji dnia diety.
// `children` to przycisk zapisu, wyświetlany w nagłówku.
export default function DietDaySummaryForm({ icon, title, description, children }) {
  const { t } = useTranslation();
  const { selectedMeals } = useMealSelection();

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1400, mx: 'auto' }}>
      <FoodPageHeader
        icon={icon}
        title={title}
        description={description}
        statLabel={t('food.selectedMealsLabel')}
        statValue={selectedMeals.length}
        actions={children}
      />
      <MealsDaySummary />
      <MealsTable />
    </Box>
  );
}
