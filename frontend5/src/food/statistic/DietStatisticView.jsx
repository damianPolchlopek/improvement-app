import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TablePagination,
  TableFooter,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';

import Grid from '@mui/material/Grid';
import { Analytics, CalendarMonth, ListAlt, Layers, TrendingUp } from '@mui/icons-material';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import DietStatisticTableRow from './DietStatisticTableRow';

import PageLoader from '../../component/loader/PageLoader';
import ErrorAlert from '../../component/error/ErrorAlert';

export default function DietStatisticView() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { t } = useTranslation();
  const theme = useTheme();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['diet-summaries', page, size],
    queryFn: () => REST.getDietSummaries(page, size),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSize(+event.target.value);
    setPage(0);
  };

  if (isLoading) {
    return <PageLoader text={t('messages.loading')} />;
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Grid size={12}>
          <Card
            elevation={6}
            sx={{
              borderRadius: 3,
              background: theme.palette.card.header,
              color: 'white',
              mb: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Analytics sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  {t('food.dietStats')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('food.dietStatsDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats summary */}
        <Grid size={12}>
          <Card elevation={1} sx={{ borderRadius: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: 4,
                rowGap: 1.5,
                px: 3,
                py: 1.5,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonth fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {t('food.totalDays')}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {data?.totalElements || 0}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <ListAlt fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {t('food.displayedRecords')}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {data?.content?.length || 0}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Layers fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {t('food.totalPagesCount')}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  {data?.totalPages || 0}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Main Data Table */}
        <Grid size={12}>
          <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                background: theme.palette.card.header,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TrendingUp sx={{ fontSize: 22 }} />
              <Typography variant="subtitle1" fontWeight="600">
                {t('food.dietHistory')}
              </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ width: '50px' }}></StyledTableCell>
                    <StyledTableCell>{t('food.date')}</StyledTableCell>
                    <StyledTableCell>{t('food.kcal')}</StyledTableCell>
                    <StyledTableCell>{t('food.protein')}</StyledTableCell>
                    <StyledTableCell>{t('food.carbs')}</StyledTableCell>
                    <StyledTableCell>{t('food.fat')}</StyledTableCell>
                    <StyledTableCell>{t('food.actions')}</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((dietSummary, index) => (
                    <DietStatisticTableRow
                      key={`${dietSummary.id}-${index}`}
                      dietSummary={dietSummary}
                    />
                  ))}
                </TableBody>
                <TableFooter>
                  <StyledTableRow>
                    <TablePagination
                      size="small"
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={7}
                      count={data.totalElements}
                      rowsPerPage={size}
                      page={page}
                      SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </StyledTableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
