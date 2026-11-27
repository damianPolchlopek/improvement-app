import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { ChecklistRtl } from '@mui/icons-material';

import REST from '../../utils/REST';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import DailyForm from './DailyForm';
import DailyPrintout from './DailyPrintout';

export default function DailyView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const query = useQuery({
    queryKey: ['daily-list', page, size],
    queryFn: () => REST.getDaily(page, size),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1100, mx: 'auto' }}>
      <FoodPageHeader
        icon={<ChecklistRtl />}
        title={t('daily.title')}
        description={t('daily.description')}
        statLabel={t('daily.entriesLabel')}
        statValue={query.data?.totalElements ?? 0}
        statLoading={query.isLoading}
      />
      <DailyForm />
      <DailyPrintout
        query={query}
        page={page}
        size={size}
        onPageChange={setPage}
        onSizeChange={(value) => {
          setSize(value);
          setPage(0);
        }}
      />
    </Box>
  );
}
