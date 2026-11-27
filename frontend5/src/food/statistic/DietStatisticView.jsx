import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
  TableCell,
  TableContainer,
} from '@mui/material';
import { Analytics } from '@mui/icons-material';

import REST from '../../utils/REST';
import DietStatisticTableRow from './DietStatisticTableRow';
import ErrorAlert from '../../component/error/ErrorAlert';
import FoodPageHeader from '../component/FoodPageHeader';
import { HAIRLINE, surfaceSx } from '../../tokens';

export default function DietStatisticView() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['diet-summaries', page, size],
    queryFn: () => REST.getDietSummaries(page, size),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const handleChangeRowsPerPage = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1400, mx: 'auto' }}>
      <FoodPageHeader
        icon={<Analytics />}
        title={t('food.dietStats')}
        description={t('food.dietStatsDesc')}
        statLabel={t('food.daysLabel')}
        statValue={data?.totalElements ?? 0}
        statLoading={isLoading}
      />

      {isError ? (
        <ErrorAlert error={error} />
      ) : (
        <Box sx={surfaceSx}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 56 }} />
                  <TableCell>{t('food.date')}</TableCell>
                  <TableCell align="right">{t('food.kcal')}</TableCell>
                  <TableCell align="right">{t('food.protein')}</TableCell>
                  <TableCell align="right">{t('food.carbs')}</TableCell>
                  <TableCell align="right">{t('food.fat')}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, width: 160 }}>
                    {t('food.macroSplit')}
                  </TableCell>
                  <TableCell align="right" sx={{ width: 100 }}>
                    {t('food.actions')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={8}>
                          <Skeleton height={32} />
                        </TableCell>
                      </TableRow>
                    ))
                  : data.content.map((dietSummary, index) => (
                      <DietStatisticTableRow
                        key={`${dietSummary.id}-${index}`}
                        dietSummary={dietSummary}
                      />
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!isLoading && (
            <TablePagination
              component="div"
              size="small"
              rowsPerPageOptions={[5, 10, 25]}
              count={data.totalElements}
              rowsPerPage={size}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderTop: HAIRLINE }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
