import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import REST from '../../utils/REST';

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Toolbar,
  useTheme,
} from '@mui/material';

import Grid from '@mui/material/Grid';
import { TrendingUp, TrendingDown, Analytics, ShowChart } from '@mui/icons-material';

import StyledTableCell from '../../component/table/StyledTableCell';
import StyledTableRow from '../../component/table/StyledTableRow';
import CryptoPricesTableRow from './CryptoPricesTableRow';

import PageLoader from '../../component/loader/PageLoader';
import ErrorAlert from '../../component/error/ErrorAlert';
import { COIN_LIST } from './COIN_LIST';

function datediff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function calculateDays(prevDate) {
  const newDate = new Date();
  const mdy = prevDate.split('-');
  const firstDate = new Date(mdy[0], mdy[1], mdy[2]);
  return datediff(firstDate, newDate);
}

export default function FinanceView() {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    data: cryptoDataResponse,
    isLoading: loadingPrices,
    isError: errorPrices,
    error: priceError,
  } = useQuery({
    queryKey: ['crypto-prices', COIN_LIST.join(',')],
    queryFn: () => REST.getFinanceCryptoPrice(COIN_LIST.join(','), 'USD'),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: cryptoDescription,
    isLoading: loadingDesc,
    isError: errorDesc,
    error: descError,
  } = useQuery({
    queryKey: ['crypto-description'],
    queryFn: () => REST.getFinanceCryptoDescription(),
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = loadingPrices || loadingDesc;
  const isError = errorPrices || errorDesc;
  const error = priceError || descError;

  if (isLoading) {
    return <PageLoader text={t('finance.loadingCrypto')} />;
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  const cryptoData = cryptoDataResponse?.data || cryptoDataResponse;
  const btcStats = cryptoDescription?.BTC;

  return (
    <Box sx={{ py: 4 }}>
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        {/* Header Section */}
        <Grid size={12}>
          <Card
            elevation={2}
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
                  {t('finance.cryptoPrices')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('finance.cryptoPricesDesc')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Bitcoin Statistics */}
        {btcStats && (
          <Grid size={12}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <Toolbar
                sx={{
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  columnGap: 4,
                  rowGap: 1.5,
                  py: 1.5,
                  minHeight: 'auto',
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('finance.weeksFromAth')}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="600">
                    {(calculateDays(btcStats.athDate) / 7).toFixed(1)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('finance.weeksFromBottom')}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="600">
                    {(calculateDays('2022-11-21') / 7).toFixed(1)}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingDown fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {t('finance.weeksToHalving')}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="600">
                    {((calculateDays('2024-04-26') / 7) * -1).toFixed(1)}
                  </Typography>
                </Box>
              </Toolbar>
            </Card>
          </Grid>
        )}

        {/* Main Crypto Table */}
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
              <ShowChart sx={{ fontSize: 22 }} />
              <Typography variant="subtitle1" fontWeight="600">
                {t('finance.cryptoTable')}
              </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell>{t('finance.name')}</StyledTableCell>
                    <StyledTableCell>{t('finance.price')}</StyledTableCell>
                    <StyledTableCell>24h</StyledTableCell>
                    <StyledTableCell>7d</StyledTableCell>
                    <StyledTableCell>30d</StyledTableCell>
                    <StyledTableCell>90d</StyledTableCell>
                    <StyledTableCell>{t('finance.athDate')}</StyledTableCell>
                    <StyledTableCell>ATH</StyledTableCell>
                    <StyledTableCell>{t('finance.fromAth')}</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {cryptoData &&
                    cryptoDescription &&
                    COIN_LIST.map((symbol) => (
                      <CryptoPricesTableRow
                        key={symbol}
                        symbol={symbol}
                        coinData={cryptoData[symbol]}
                        coinDescription={cryptoDescription[symbol]}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
