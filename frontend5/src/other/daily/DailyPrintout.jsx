import React from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import REST from '../../utils/REST';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableFooter,
  TablePagination,
  Paper,
  Card,
  Box,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { useState } from 'react';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import PageLoader from '../../component/loader/PageLoader';
import ErrorAlert from '../../component/error/ErrorAlert';

export default function DailyPrintout() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { t } = useTranslation();
  const theme = useTheme();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['daily-list', page, size],
    queryFn: () => REST.getDaily(page, size),
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
    <Box sx={{ py: 2 }}>
      <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            background: theme.palette.card.header,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TrendingUp sx={{ fontSize: 22 }} />
          <Typography variant="subtitle1" fontWeight="600">
            {t('daily.history')}
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>{t('daily.date')}</StyledTableCell>
                <StyledTableCell>{t('daily.smoking')}</StyledTableCell>
                <StyledTableCell>{t('daily.exercise')}</StyledTableCell>
                <StyledTableCell>{t('daily.book')}</StyledTableCell>
                <StyledTableCell>{t('daily.work')}</StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {data?.content?.map((daily, index) => (
                <StyledTableRow
                  key={daily.id || index}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <StyledTableCell>
                    <Typography variant="body2" fontWeight="600">
                      {daily.date}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={daily.smoking ? t('common.yes') : t('common.no')}
                      color={daily.smoking ? 'success' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={daily.exercise ? t('common.yes') : t('common.no')}
                      color={daily.exercise ? 'success' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={daily.book ? t('common.yes') : t('common.no')}
                      color={daily.book ? 'success' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={daily.work ? t('common.yes') : t('common.no')}
                      color={daily.work ? 'success' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>

            <TableFooter>
              <StyledTableRow>
                <TablePagination
                  size="small"
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={5}
                  count={data?.totalElements || 0}
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
    </Box>
  );
}
