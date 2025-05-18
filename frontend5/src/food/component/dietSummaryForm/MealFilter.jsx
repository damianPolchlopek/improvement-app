import { MenuItem, Select, Toolbar, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { useMealSelection } from '../../../context/MealSelectionContext';

export default function MealFilter({ mealPopularity, setMealPopularity }) {
  const { t } = useTranslation();
  const { clearSelections } = useMealSelection();

  return (
    <Toolbar>
      <Typography sx={{ marginRight: '20px' }}>
        {t('food.mealPopularity')}
      </Typography>

      <Select
        value={mealPopularity}
        onChange={(e) => setMealPopularity(e.target.value)}
      >
        <MenuItem value="ALL">{t('food.all')}</MenuItem>
        <MenuItem value="HIGH">{t('food.popular')}</MenuItem>
        <MenuItem value="LOW">{t('food.rare')}</MenuItem>
      </Select>
      <Button
        variant="contained"
        sx={{ marginLeft: 'auto' }}
        onClick={clearSelections}
      >
        Clear Selections
      </Button>
    </Toolbar>
  );
}

MealFilter.propTypes = {
  mealPopularity: PropTypes.string.isRequired,
  setMealPopularity: PropTypes.func.isRequired
};
