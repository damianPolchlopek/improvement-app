import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  CircularProgress,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { Restaurant, Analytics, TrendingUp } from '@mui/icons-material';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import DietStatisticTableRow from "./DietStatisticTableRow";

export default function DietStatisticView() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { t } = useTranslation();
  const theme = useTheme();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['diet-summaries', page, size],
    queryFn: () => REST.getDietSummaries(page, size),
    keepPreviousData: true,
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
    return (
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
          <Grid xs={12}>
            <Card elevation={6} sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {t('messages.loading')}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
          <Grid xs={12}>
            <Card elevation={6} sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="error">
                Error: {error?.message || 'Unknown error'}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>

        {/* Header Section */}
        <Grid xs={12}>
          <Card elevation={6} sx={{
            borderRadius: 3,
            background: theme.palette.card.header,
            color: 'white',
            mb: 2
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Analytics sx={{ fontSize: 32 }} />
                <Typography variant="h4" fontWeight="600">
                  Statystyki Diety
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Przegląd Twoich dziennych podsumowań żywieniowych
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Cards */}
        <Grid xs={12} md={4}>
          <Card elevation={6} sx={{
            height: '100%',
            borderRadius: 3,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Restaurant sx={{ color: '#4caf50', fontSize: 28 }} />
                <Typography variant="h6" fontWeight="600">
                  Łączna liczba dni
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="700" color="primary">
                {data?.totalElements || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card elevation={4} sx={{
            height: '100%',
            borderRadius: 3,
            background: 'linear-gradient(45deg, #ff9800, #f57c00)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3
          }}>
            <Box>
              <Typography variant="h3" fontWeight="700">
                {data?.content?.length || 0}
              </Typography>
              <Typography variant="body1">
                Wyświetlanych rekordów
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card elevation={4} sx={{
            height: '100%',
            borderRadius: 3,
            background: 'linear-gradient(45deg, #2196f3, #1976d2)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3
          }}>
            <Box>
              <Typography variant="h3" fontWeight="700">
                {data?.totalPages || 0}
              </Typography>
              <Typography variant="body1">
                Wszystkich stron
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Main Data Table */}
        <Grid xs={12}>
          <Card elevation={8} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{
              p: 3,
              background: theme.palette.card.header,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <TrendingUp sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight="600">
                Historia Diety
              </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ width: "50px" }}></StyledTableCell>
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