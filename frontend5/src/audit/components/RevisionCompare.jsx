// features/diet-audit/components/RevisionCompare.jsx
// Wybór dwóch rewizji i porównanie: makroskładniki przed / po oraz zmiany w posiłkach.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Alert, Box, Button, ButtonBase, CircularProgress, Typography } from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  CompareArrows as CompareArrowsIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

import { useRevisionComparison } from '../hooks/useDietAudit';
import {
  formatMacroChange,
  formatRevisionType,
  formatTimestamp,
  getMacroChangeColor,
} from '../utils/auditFormatters';
import MealChangesList from './MealChangesList';
import { AccentIcon, MacroTiles, Section } from './auditUi';
import { formatMacro } from '../../food/foodView/macroColors';
import { HAIRLINE } from '../../tokens';

const RevisionCompare = ({
  dietSummaryId,
  selectedRevisions,
  onRevisionSelect,
  availableRevisions,
}) => {
  const { t } = useTranslation();
  const { dietSummaryId: paramDietSummaryId } = useParams();
  const actualDietSummaryId = dietSummaryId || paramDietSummaryId;

  const needsSelection = selectedRevisions.length < 2;

  const {
    data: comparisonData,
    isLoading,
    isError,
  } = useRevisionComparison(
    actualDietSummaryId,
    selectedRevisions[0]?.revisionNumber,
    selectedRevisions[1]?.revisionNumber
  );

  if (needsSelection) {
    return (
      <Section
        icon={<CompareArrowsIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
        title={t('audit.selectTwo')}
        actions={
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {selectedRevisions.length === 1
              ? t('audit.selectSecond')
              : t('audit.selectedCount', { count: selectedRevisions.length })}
          </Typography>
        }
      >
        <Box
          sx={{
            p: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 1,
          }}
        >
          {availableRevisions.map((revision) => {
            const order = selectedRevisions.findIndex(
              (r) => r.revisionNumber === revision.revisionNumber
            );
            const isSelected = order !== -1;
            const typeInfo = formatRevisionType(revision.revisionType);
            const time = formatTimestamp(revision.revisionTimestamp);

            return (
              <ButtonBase
                key={revision.revisionNumber}
                onClick={() => onRevisionSelect(revision)}
                aria-pressed={isSelected}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  p: 1.25,
                  textAlign: 'left',
                  borderRadius: 2,
                  bgcolor: isSelected ? 'primaryTint.subtle' : 'surface.tile',
                  border: '1px solid',
                  borderColor: isSelected ? 'primary.main' : 'line.hairline',
                  '&:hover': { borderColor: isSelected ? 'primary.main' : 'line.hover' },
                }}
              >
                <AccentIcon accent={typeInfo.accent} Icon={typeInfo.Icon} size={28} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    #{revision.revisionNumber}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                    {time.date}, {time.time}
                  </Typography>
                </Box>
                {isSelected && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: 12,
                      color: 'primary.main',
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 14 }} />
                    {order === 0 ? t('audit.older') : t('audit.newer')}
                  </Box>
                )}
              </ButtonBase>
            );
          })}
        </Box>
      </Section>
    );
  }

  if (isLoading) {
    return (
      <Section>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, py: 6 }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('audit.loadingComparison')}
          </Typography>
        </Box>
      </Section>
    );
  }

  if (isError || !comparisonData) {
    return <Alert severity="error">{t('audit.comparisonError')}</Alert>;
  }

  const { olderRevision, newerRevision, macroChanges, mealsAdded, mealsRemoved, mealsModified } =
    comparisonData;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Section
        icon={<CompareArrowsIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
        title={t('audit.versionComparison')}
        actions={
          <Button size="small" onClick={() => onRevisionSelect(null)}>
            {t('audit.selectOther')}
          </Button>
        }
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
            alignItems: 'center',
            gap: 2,
            p: 2,
          }}
        >
          <VersionInfo title={t('audit.olderVersion')} revision={olderRevision} />
          <ArrowForwardIcon
            sx={{
              color: 'text.secondary',
              justifySelf: 'center',
              transform: { xs: 'rotate(90deg)', md: 'none' },
            }}
          />
          <VersionInfo title={t('audit.newerVersion')} revision={newerRevision} highlight />
        </Box>

        <Box sx={{ px: 2, pb: 2, pt: 2, borderTop: HAIRLINE }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            {t('audit.macroChanges')}
          </Typography>
          <MacroTiles
            t={t}
            render={(key, unit, color) => (
              <MacroChange changeDetail={macroChanges[key]} unit={unit} color={color} />
            )}
          />
        </Box>
      </Section>

      <MealChangesList changes={{ mealsAdded, mealsRemoved, mealsModified }} />
    </Box>
  );
};

const VersionInfo = ({ title, revision, highlight = false }) => {
  const { t } = useTranslation();
  const time = formatTimestamp(revision.revisionTimestamp);
  const rows = [
    [t('audit.revision'), `#${revision.revisionNumber}`],
    [t('audit.date'), time.date],
    [t('audit.time'), time.time],
    [t('audit.calories'), `${formatMacro(revision.dietSummary.kcal)} kcal`],
  ];

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: highlight ? 'primaryTint.subtle' : 'surface.subtle',
        border: '1px solid',
        borderColor: highlight ? 'primaryTint.strong' : 'line.hairline',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
        {title}
      </Typography>
      {rows.map(([label, value]) => (
        <Box
          key={label}
          sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.25 }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {label}
          </Typography>
          <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const MacroChange = ({ changeDetail, unit, color }) => {
  const { oldValue, newValue, diff, percentChange } = changeDetail;
  const changeColor = getMacroChangeColor(diff);
  const hasChange = Math.abs(diff) > 0.1;
  const TrendIcon = diff > 0 ? TrendingUpIcon : diff < 0 ? TrendingDownIcon : TrendingFlatIcon;

  return (
    <Box sx={{ fontVariantNumeric: 'tabular-nums' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500, color }}>
          {formatMacro(newValue)}
          <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
            {unit}
          </Typography>
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', textDecoration: 'line-through' }}
        >
          {formatMacro(oldValue)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: 12,
          color: hasChange ? changeColor : 'text.secondary',
        }}
      >
        <TrendIcon sx={{ fontSize: 14 }} />
        {hasChange ? `${formatMacroChange(diff)} (${percentChange.toFixed(1)}%)` : '—'}
      </Box>
    </Box>
  );
};

export default RevisionCompare;
