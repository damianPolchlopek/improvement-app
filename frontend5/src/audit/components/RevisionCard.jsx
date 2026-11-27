// features/diet-audit/components/RevisionCard.jsx
// Rozwijany wiersz rewizji. Szczegóły (makro, posiłki) pobierane dopiero po rozwinięciu.

import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, CircularProgress, Collapse, Typography } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import { useRevisionDetails } from '../hooks/useDietAudit';
import { formatRevisionType, formatTimestamp } from '../utils/auditFormatters';
import { AccentIcon, MacroInline, MacroTiles, MacroValue } from './auditUi';
import { ROW_LINE } from '../../tokens';

const RevisionCard = ({ revision, onClick, isSelected }) => {
  const { t } = useTranslation();
  const { dietSummaryId } = useParams();

  // Lazy loading – pełne dane tylko dla rozwiniętej rewizji
  const { data: fullRevision, isLoading: isLoadingDetails } = useRevisionDetails(
    dietSummaryId,
    isSelected ? revision.revisionNumber : null
  );

  const typeInfo = formatRevisionType(revision.revisionType);
  const timeInfo = formatTimestamp(revision.revisionTimestamp);
  const dietSummary = fullRevision?.dietSummary;
  const meals = dietSummary?.meals || [];

  return (
    <Box
      sx={{
        borderTop: ROW_LINE,
        '&:first-of-type': { borderTop: 0 },
        bgcolor: isSelected ? 'primaryTint.subtle' : 'transparent',
      }}
    >
      <ButtonBase
        onClick={onClick}
        aria-expanded={isSelected}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.25,
          textAlign: 'left',
          '&:hover': { bgcolor: isSelected ? 'primaryTint.selected' : 'surface.hoverStrong' },
        }}
      >
        <AccentIcon accent={typeInfo.accent} Icon={typeInfo.Icon} size={32} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t('audit.revisionNo', { number: revision.revisionNumber })}
          </Typography>
          <Typography variant="caption" sx={{ color: typeInfo.accent.light }}>
            {typeInfo.label}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {timeInfo.time}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {timeInfo.relative}
          </Typography>
        </Box>
        <ExpandMoreIcon
          fontSize="small"
          sx={{
            color: 'text.secondary',
            transform: isSelected ? 'rotate(180deg)' : 'none',
            transition: 'transform .2s',
          }}
        />
      </ButtonBase>

      <Collapse in={isSelected} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 2, pt: 0.5 }}>
          {isLoadingDetails || !dietSummary ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
              {isLoadingDetails && <CircularProgress size={18} />}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isLoadingDetails ? t('audit.loadingDetails') : t('audit.clickToSee')}
              </Typography>
            </Box>
          ) : (
            <>
              <MacroTiles
                t={t}
                render={(key, unit, color) => (
                  <MacroValue value={dietSummary[key]} unit={unit} color={color} />
                )}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 2,
                  mb: 1,
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {t('audit.mealsCount', { count: meals.length })}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {t('audit.dietDate')}:{' '}
                  <Box component="span" sx={{ color: 'text.primary' }}>
                    {dietSummary.date}
                  </Box>
                </Typography>
              </Box>

              {meals.map((meal, index) => (
                <Box
                  key={meal.id || index}
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 2,
                    py: 0.75,
                    borderTop: ROW_LINE,
                  }}
                >
                  <Typography variant="body2" sx={{ minWidth: 0 }} noWrap>
                    {meal.name}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ color: 'text.secondary', ml: 1 }}
                    >
                      {meal.portionMultiplier}×
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
              ))}
            </>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default RevisionCard;
