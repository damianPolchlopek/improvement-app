// features/diet-audit/components/AuditFilters.jsx
// Zwarty rząd filtrów pod nagłówkiem strony: typ zmiany (chipy), zakres dat i nazwa posiłku.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, TextField } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

import SearchField from '../../food/component/SearchField';
import { fieldSx } from '../../tokens';
import { REVISION_TYPES } from '../utils/auditFormatters';

const EMPTY_FILTERS = { dateFrom: null, dateTo: null, revisionType: 'ALL', searchTerm: '' };

const dateFieldSx = {
  ...fieldSx,
  width: 160,
  '& input[type="date"]::-webkit-calendar-picker-indicator': { filter: 'invert(0.8)' },
};

const AuditFilters = ({ filters, setFilters }) => {
  const { t } = useTranslation();

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const hasActiveFilters =
    filters.dateFrom || filters.dateTo || filters.revisionType !== 'ALL' || filters.searchTerm;

  const typeChips = [
    { value: 'ALL', label: t('audit.all') },
    ...Object.entries(REVISION_TYPES).map(([value, info]) => ({
      value,
      label: t(info.labelKey),
      dot: info.accent.dot,
    })),
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, width: '100%' }}>
      {typeChips.map(({ value, label, dot }) => {
        const active = filters.revisionType === value;
        return (
          <Chip
            key={value}
            label={label}
            clickable
            color={active ? 'primary' : 'default'}
            variant={active ? 'filled' : 'outlined'}
            aria-pressed={active}
            onClick={() => setFilter('revisionType', value)}
            icon={
              dot ? (
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: dot,
                    ml: '10px !important',
                  }}
                />
              ) : undefined
            }
            sx={{ fontWeight: active ? 600 : 400 }}
          />
        );
      })}

      <Box sx={{ flex: '1 1 0', minWidth: 8 }} />

      <TextField
        size="small"
        type="date"
        label={t('audit.dateFrom')}
        value={filters.dateFrom || ''}
        onChange={(event) => setFilter('dateFrom', event.target.value || null)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={dateFieldSx}
      />
      <TextField
        size="small"
        type="date"
        label={t('audit.dateTo')}
        value={filters.dateTo || ''}
        onChange={(event) => setFilter('dateTo', event.target.value || null)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={dateFieldSx}
      />
      <SearchField
        value={filters.searchTerm}
        onChange={(value) => setFilter('searchTerm', value)}
        placeholder={t('audit.mealNamePlaceholder')}
        sx={{ width: { xs: '100%', sm: 220 } }}
      />

      {hasActiveFilters && (
        <Button
          size="small"
          startIcon={<ClearIcon />}
          onClick={() => setFilters(EMPTY_FILTERS)}
          sx={{ color: 'text.secondary' }}
        >
          {t('audit.clear')}
        </Button>
      )}
    </Box>
  );
};

export default AuditFilters;
