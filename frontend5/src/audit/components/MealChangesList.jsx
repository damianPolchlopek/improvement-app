// features/diet-audit/components/MealChangesList.jsx
// Zmiany w posiłkach między dwiema rewizjami: dodane, usunięte i zmodyfikowane.

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, Collapse, Typography } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';

import { AccentIcon, EmptyState, MacroInline, Section } from './auditUi';
import { REVISION_TYPES } from '../utils/auditFormatters';
import { ROW_LINE, STATUS } from '../../tokens';

const ADDED = REVISION_TYPES.ADD;
const REMOVED = REVISION_TYPES.DEL;
const MODIFIED = REVISION_TYPES.MOD;

const MealChangesList = ({ changes }) => {
  const { t } = useTranslation();
  const [expandedMeals, setExpandedMeals] = useState(new Set());

  const toggleMeal = (mealId) => {
    setExpandedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(mealId)) next.delete(mealId);
      else next.add(mealId);
      return next;
    });
  };

  const { mealsAdded, mealsRemoved, mealsModified } = changes;

  if (mealsAdded.length + mealsRemoved.length + mealsModified.length === 0) {
    return (
      <EmptyState
        Icon={RestaurantIcon}
        title={t('audit.noMealChanges')}
        description={t('audit.noMealChangesDesc')}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {mealsAdded.length > 0 && (
        <Section
          icon={<AccentIcon accent={ADDED.accent} Icon={ADDED.Icon} size={28} />}
          title={t('audit.mealsAddedCount', { count: mealsAdded.length })}
        >
          {mealsAdded.map((meal) => (
            <MealRow key={meal.id} meal={meal} />
          ))}
        </Section>
      )}

      {mealsRemoved.length > 0 && (
        <Section
          icon={<AccentIcon accent={REMOVED.accent} Icon={REMOVED.Icon} size={28} />}
          title={t('audit.mealsRemovedCount', { count: mealsRemoved.length })}
        >
          {mealsRemoved.map((meal) => (
            <MealRow key={meal.id} meal={meal} removed />
          ))}
        </Section>
      )}

      {mealsModified.length > 0 && (
        <Section
          icon={<AccentIcon accent={MODIFIED.accent} Icon={MODIFIED.Icon} size={28} />}
          title={t('audit.mealsModifiedCount', { count: mealsModified.length })}
        >
          {mealsModified.map(({ meal, changes: mealChanges }) => (
            <ModifiedMealRow
              key={meal.id}
              meal={meal}
              changes={mealChanges}
              isExpanded={expandedMeals.has(meal.id)}
              onToggle={() => toggleMeal(meal.id)}
            />
          ))}
        </Section>
      )}
    </Box>
  );
};

const rowSx = {
  px: 2,
  py: 1.25,
  borderTop: ROW_LINE,
  '&:first-of-type': { borderTop: 0 },
};

// Dodany / usunięty posiłek: nazwa, porcja, makro i kilka pierwszych składników.
const MealRow = ({ meal, removed = false }) => {
  const { t } = useTranslation();
  const ingredients = meal.ingredients ?? [];

  return (
    <Box sx={rowSx}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          columnGap: 2,
          rowGap: 0.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            ...(removed && { textDecoration: 'line-through', color: 'text.secondary' }),
          }}
        >
          {meal.name}
          <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
            {t('audit.portion')} {meal.portionMultiplier}×
          </Typography>
        </Typography>
        <MacroInline
          t={t}
          kcal={meal.cachedKcal}
          protein={meal.cachedProtein}
          carbohydrates={meal.cachedCarbohydrates}
          fat={meal.cachedFat}
        />
      </Box>

      {ingredients.length > 0 && (
        <Typography variant="caption" component="div" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {ingredients
            .slice(0, 3)
            .map((ing) => `${ing.name} ${ing.amount} ${ing.unit}`)
            .join(' · ')}
          {ingredients.length > 3 && ` ${t('audit.andMore', { count: ingredients.length - 3 })}`}
        </Typography>
      )}
    </Box>
  );
};

// Zmodyfikowany posiłek: podsumowanie zmian w wierszu, szczegóły składników po rozwinięciu.
const ModifiedMealRow = ({ meal, changes, isExpanded, onToggle }) => {
  const { t } = useTranslation();
  const { ingredientsAdded, ingredientsRemoved, ingredientsModified } = changes;
  const ingredientChanges =
    ingredientsAdded.length + ingredientsRemoved.length + ingredientsModified.length;
  const macrosChanged = Object.values(changes.macrosChanged).some(Boolean);

  const summary = [
    changes.portionChanged && t('audit.portionChanged'),
    macrosChanged && t('audit.macrosChangedText'),
    ingredientChanges > 0 && t('audit.ingredientChangesCount', { count: ingredientChanges }),
  ].filter(Boolean);

  return (
    <Box sx={{ ...rowSx, px: 0, py: 0 }}>
      <ButtonBase
        onClick={onToggle}
        aria-expanded={isExpanded}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.25,
          textAlign: 'left',
          '&:hover': { bgcolor: 'surface.hoverStrong' },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {meal.name}
            <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              {t('audit.changesCount', { count: summary.length })}
            </Typography>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {summary.join(' · ')}
          </Typography>
        </Box>
        <ExpandMoreIcon
          fontSize="small"
          sx={{
            color: 'text.secondary',
            transform: isExpanded ? 'rotate(180deg)' : 'none',
            transition: 'transform .2s',
          }}
        />
      </ButtonBase>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {ingredientsAdded.length > 0 && (
            <IngredientGroup
              icon={AddIcon}
              color={ADDED.accent.light}
              title={t('audit.ingredientsAdded')}
            >
              {ingredientsAdded.map((ing) => (
                <Typography key={ing.id} variant="body2">
                  {ing.name}{' '}
                  <Box component="span" sx={{ color: 'text.secondary' }}>
                    {ing.amount} {ing.unit}
                  </Box>
                </Typography>
              ))}
            </IngredientGroup>
          )}

          {ingredientsRemoved.length > 0 && (
            <IngredientGroup
              icon={REMOVED.Icon}
              color={REMOVED.accent.light}
              title={t('audit.ingredientsRemoved')}
            >
              {ingredientsRemoved.map((ing) => (
                <Typography
                  key={ing.id}
                  variant="body2"
                  sx={{ color: 'text.secondary', textDecoration: 'line-through' }}
                >
                  {ing.name} {ing.amount} {ing.unit}
                </Typography>
              ))}
            </IngredientGroup>
          )}

          {ingredientsModified.length > 0 && (
            <IngredientGroup
              icon={EditIcon}
              color={MODIFIED.accent.light}
              title={t('audit.ingredientsModified')}
            >
              {ingredientsModified.map(({ ingredient, oldAmount, newAmount }) => {
                const diff = newAmount - oldAmount;
                return (
                  <Typography
                    key={ingredient.id}
                    variant="body2"
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {ingredient.name}{' '}
                    <Box
                      component="span"
                      sx={{ color: 'text.secondary', textDecoration: 'line-through' }}
                    >
                      {oldAmount}
                    </Box>{' '}
                    → {newAmount} {ingredient.unit}
                    {diff !== 0 && (
                      <Box
                        component="span"
                        sx={{ ml: 1, fontSize: 12, color: diff > 0 ? STATUS.up : STATUS.down }}
                      >
                        {diff > 0 ? '+' : ''}
                        {diff.toFixed(1)}
                      </Box>
                    )}
                  </Typography>
                );
              })}
            </IngredientGroup>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

const IngredientGroup = ({ icon: Icon, color, title, children }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
      <Icon sx={{ fontSize: 16, color }} />
      <Typography variant="caption" sx={{ color, fontWeight: 500 }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column', gap: 0.25 }}>{children}</Box>
  </Box>
);

export default MealChangesList;
