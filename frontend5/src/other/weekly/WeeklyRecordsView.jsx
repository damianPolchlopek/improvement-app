import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Skeleton } from '@mui/material';
import { ListAlt } from '@mui/icons-material';

import REST from '../../utils/REST';
import ErrorAlert from '../../component/error/ErrorAlert';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import WeeklyForm from './WeeklyForm';
import WeeklyRecordsTable from './WeeklyRecordsTable';

export default function WeeklyRecordsView() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const { t } = useTranslation();

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['weekly-record-categories'],
    queryFn: () => REST.getAllCategoryWeeklyRecords(),
  });

  const categories = useMemo(() => categoriesData || [], [categoriesData]);

  // Domyślna kategoria jako wartość pochodna (bez efektu / setState)
  const effectiveCategory = selectedCategory || categories[0] || '';

  const {
    data: records,
    isLoading: recordsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['weekly-records', effectiveCategory],
    queryFn: () => REST.getWeeklyListByCategory(effectiveCategory),
    enabled: !!effectiveCategory,
    staleTime: 1000 * 60 * 5,
  });

  const recordsList = records || [];

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1100, mx: 'auto' }}>
      <FoodPageHeader
        icon={<ListAlt />}
        title={t('weekly.title')}
        description={t('weekly.subtitle')}
        statLabel={t('weekly.recordsInCategory')}
        statValue={recordsList.length}
        statLoading={categoriesLoading || recordsLoading}
      >
        {categoriesLoading
          ? [0, 1, 2].map((i) => (
              <Skeleton key={i} variant="rounded" width={90} height={32} sx={{ borderRadius: 4 }} />
            ))
          : categories.map((category) => {
              const active = category === effectiveCategory;
              return (
                <Chip
                  key={category}
                  label={category}
                  clickable
                  color={active ? 'primary' : 'default'}
                  variant={active ? 'filled' : 'outlined'}
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(category)}
                  sx={{ fontWeight: active ? 600 : 400 }}
                />
              );
            })}
      </FoodPageHeader>

      <WeeklyForm categories={categories} defaultCategory={effectiveCategory} />

      {isError ? (
        <ErrorAlert error={error} />
      ) : (
        <WeeklyRecordsTable
          records={recordsList}
          category={effectiveCategory}
          isLoading={categoriesLoading || recordsLoading}
        />
      )}
    </Box>
  );
}
