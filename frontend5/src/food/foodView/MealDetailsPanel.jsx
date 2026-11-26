import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Button, Card, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { ExpandLess, OpenInNew, Kitchen, MenuBook } from '@mui/icons-material';

import REST from '../../utils/REST';
import MacroBar from './MacroBar';
import { MACRO_COLORS, INGREDIENT_CATEGORY_ORDER, formatMacro } from './macroColors';

function SectionTitle({ icon, children }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'text.secondary' }}>
      {icon}
      <Typography variant="overline" sx={{ lineHeight: 1, letterSpacing: 1 }}>
        {children}
      </Typography>
    </Box>
  );
}

function Ingredients({ mealId }) {
  const { t } = useTranslation();
  const { data: ingredients = {}, isLoading } = useQuery({
    queryKey: ['mealIngredients', mealId],
    queryFn: () => REST.getMealIngredients(mealId),
    enabled: !!mealId,
  });

  if (isLoading) {
    return [0, 1, 2, 3].map((i) => <Skeleton key={i} height={28} />);
  }

  const groups = INGREDIENT_CATEGORY_ORDER.filter((cat) => ingredients[cat]?.length > 0);

  if (groups.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {t('food.noProducts')}
      </Typography>
    );
  }

  return groups.map((cat) => (
    <Box key={cat} sx={{ mb: 1.5 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {t(`food.productCategoryNames.${cat}`, { defaultValue: cat })}
      </Typography>
      {ingredients[cat].map((ingredient, index) => (
        <Box
          key={ingredient.id ?? index}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            py: 0.75,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Typography variant="body2">{ingredient.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {formatMacro(ingredient.amount)} {ingredient.unit}
          </Typography>
        </Box>
      ))}
    </Box>
  ));
}

function Recipe({ steps }) {
  const { t } = useTranslation();

  if (!steps?.length) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {t('food.noRecipes')}
      </Typography>
    );
  }

  return (
    <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {steps.map((step, index) => (
        <Box component="li" key={index} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              flexShrink: 0,
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'rgba(144, 202, 249, 0.16)',
              color: 'primary.main',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {index + 1}
          </Box>
          <Typography variant="body2" sx={{ pt: 0.25, lineHeight: 1.6 }}>
            {step}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// Szczegóły posiłku rozwijane w siatce, pod rzędem z klikniętą kartą.
export default function MealDetailsPanel({ meal, onClose }) {
  const { t } = useTranslation();
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [meal.id]);

  const stats = [
    { key: 'kcal', label: 'kcal', value: Math.round(meal.kcal), unit: '' },
    { key: 'protein', label: t('food.proteinShort'), value: formatMacro(meal.protein), unit: 'g' },
    {
      key: 'carbohydrates',
      label: t('food.carbsShort'),
      value: formatMacro(meal.carbohydrates),
      unit: 'g',
    },
    { key: 'fat', label: t('food.fatShort'), value: formatMacro(meal.fat), unit: 'g' },
  ];

  const typeLabel = meal.type ? t(`food.mealTypes.${meal.type}`, { defaultValue: meal.type }) : '';
  const portionLabel = meal.portionAmount
    ? `${t('food.portion')} ×${formatMacro(meal.portionAmount)}`
    : '';

  return (
    <Card
      ref={ref}
      elevation={0}
      role="region"
      aria-label={meal.name}
      sx={{
        borderRadius: 2.5,
        bgcolor: 'rgba(23, 37, 47, 0.95)',
        border: '1px solid',
        borderColor: 'primary.main',
        p: { xs: 2, md: 3 },
        animation: 'mealPanelIn 180ms ease-out',
        '@keyframes mealPanelIn': {
          from: { opacity: 0, transform: 'translateY(-6px)' },
          to: { opacity: 1, transform: 'none' },
        },
      }}
    >
      {/* Nagłówek: nazwa, makro, akcje */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
        <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {[typeLabel, portionLabel].filter(Boolean).join(' · ')}
          </Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 500, lineHeight: 1.3 }}>
            {meal.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'baseline' }}>
          {stats.map((stat) => (
            <Box key={stat.key} sx={{ textAlign: 'right' }}>
              <Typography
                component="span"
                sx={{ fontSize: 20, fontWeight: 500, color: MACRO_COLORS[stat.key].text }}
              >
                {stat.value}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.secondary', ml: 0.5 }}
              >
                {stat.unit ? `${stat.unit} ${stat.label}` : stat.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {meal.url && (
            <Button
              href={meal.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              endIcon={<OpenInNew fontSize="small" />}
            >
              {t('food.viewRecipe')}
            </Button>
          )}
          <Tooltip title={t('food.collapse')}>
            <IconButton aria-label={t('food.collapse')} onClick={onClose} size="small">
              <ExpandLess />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <MacroBar
        protein={meal.protein}
        carbohydrates={meal.carbohydrates}
        fat={meal.fat}
        height={8}
      />

      {/* Składniki i przygotowanie obok siebie */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 2fr) minmax(0, 3fr)' },
          columnGap: 4,
          rowGap: 3,
          mt: 3,
        }}
      >
        <Box>
          <SectionTitle icon={<Kitchen fontSize="small" />}>{t('food.ingredients')}</SectionTitle>
          <Ingredients mealId={meal.id} />
        </Box>
        <Box>
          <SectionTitle icon={<MenuBook fontSize="small" />}>{t('food.preparation')}</SectionTitle>
          <Recipe steps={meal.recipe} />
        </Box>
      </Box>
    </Card>
  );
}
