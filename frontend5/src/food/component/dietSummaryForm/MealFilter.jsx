import { useEffect, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useMealSelection } from '../../../context/MealSelectionContext';

export default function MealFilter({
  mealPopularity,
  setMealPopularity,
  searchTerm,
  setSearchTerm,
}) {
  const { t } = useTranslation();
  const { clearSelections } = useMealSelection();
  const [searchInput, setSearchInput] = useState(searchTerm ?? '');

  // Debounce: nie odpytujemy backendu na każdy znak.
  useEffect(() => {
    const id = setTimeout(() => setSearchTerm(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput, setSearchTerm]);

  return (
    <Toolbar
      sx={{
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 2,
        rowGap: 1.5,
        py: 1.5,
        minHeight: 'auto',
      }}
    >
      <Typography>{t('food.mealPopularity')}</Typography>

      <Select
        value={mealPopularity}
        onChange={(e) => setMealPopularity(e.target.value)}
        size="small"
      >
        <MenuItem value="ALL">{t('food.all')}</MenuItem>
        <MenuItem value="HIGH">{t('food.popular')}</MenuItem>
        <MenuItem value="LOW">{t('food.rare')}</MenuItem>
      </Select>

      <TextField
        size="small"
        placeholder={t('food.searchMeal')}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ minWidth: 220 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchInput ? (
            <InputAdornment position="end">
              <IconButton size="small" aria-label="clear search" onClick={() => setSearchInput('')}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      <Button variant="contained" sx={{ marginLeft: 'auto' }} onClick={clearSelections}>
        {t('food.clearSelections')}
      </Button>
    </Toolbar>
  );
}

MealFilter.propTypes = {
  mealPopularity: PropTypes.string.isRequired,
  setMealPopularity: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};
