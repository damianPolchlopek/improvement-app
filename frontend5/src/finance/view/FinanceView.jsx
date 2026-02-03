import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
  useTheme,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import { TrendingUp, Analytics, ShowChart } from '@mui/icons-material';

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
  const theme = useTheme();

  const { data: cryptoDataResponse, isLoading: loadingPrices, isError: errorPrices, error: priceError } = useQuery({
    queryKey: ['crypto-prices', COIN_LIST.join(',')],
    queryFn: () => REST.getFinanceCryptoPrice(COIN_LIST.join(','), 'USD'),
    staleTime: 1000 * 60 * 5,
  });

  const { data: cryptoDescription, isLoading: loadingDesc, isError: errorDesc, error: descError } = useQuery({
    queryKey: ['crypto-description'],
    queryFn: () => REST.getFinanceCryptoDescription(),
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = loadingPrices || loadingDesc;
  const isError = errorPrices || errorDesc;
  const error = priceError || descError;

  if (isLoading) {
    return <PageLoader text="Ładowanie danych kryptowalut..." />;
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
                  Ceny Kryptowalut
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Aktualne ceny i statystyki wybranych kryptowalut
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Bitcoin Statistics Cards */}
        {btcStats && (
          <>
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
                    <TrendingUp sx={{ color: '#4caf50', fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="600">
                      Tygodnie od ATH
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="700" color="primary">
                    {(calculateDays(btcStats.athDate) / 7).toFixed(1)}
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
                    {(calculateDays('2022-11-21') / 7).toFixed(1)}
                  </Typography>
                  <Typography variant="body1">
                    Tygodnie od dołka
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
                    {((calculateDays('2024-04-26') / 7) * -1).toFixed(1)}
                  </Typography>
                  <Typography variant="body1">
                    Tyg. do halvingu
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </>
        )}

        {/* Main Crypto Table */}
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
              <ShowChart sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight="600">
                Tabela Kryptowalut
              </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell>Nazwa</StyledTableCell>
                    <StyledTableCell>Cena</StyledTableCell>
                    <StyledTableCell>24h</StyledTableCell>
                    <StyledTableCell>7d</StyledTableCell>
                    <StyledTableCell>30d</StyledTableCell>
                    <StyledTableCell>90d</StyledTableCell>
                    <StyledTableCell>ATH Data</StyledTableCell>
                    <StyledTableCell>ATH</StyledTableCell>
                    <StyledTableCell>Od ATH</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {cryptoData && cryptoDescription && COIN_LIST.map((symbol) => (
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