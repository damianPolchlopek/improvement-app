import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Analytics } from '@mui/icons-material';

import REST from '../../utils/REST';
import ErrorAlert from '../../component/error/ErrorAlert';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import { HAIRLINE, surfaceSx } from '../../tokens';
import { financeTableSx } from '../financeStyles';
import CryptoPricesTableRow from './CryptoPricesTableRow';
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

// Kafelek liczby jak w podsumowaniu dnia modułu food.
function StatTile({ label, value }) {
  return (
    <Box sx={{ flex: '1 1 160px', bgcolor: 'surface.subtle', borderRadius: 2, px: 1.5, py: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1.4 }}>{value}</Typography>
    </Box>
  );
}

export default function FinanceView() {
  const { t } = useTranslation();

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

  const cryptoData = cryptoDataResponse?.data || cryptoDataResponse;
  const btcStats = cryptoDescription?.BTC;

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1400, mx: 'auto' }}>
      <FoodPageHeader
        icon={<Analytics />}
        title={t('finance.cryptoPrices')}
        description={t('finance.cryptoPricesDesc')}
        statLabel={t('finance.coinsLabel')}
        statValue={COIN_LIST.length}
      >
        {isLoading ? (
          <Skeleton variant="rounded" height={58} sx={{ width: '100%', borderRadius: 2 }} />
        ) : (
          btcStats && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, width: '100%' }}>
              <StatTile
                label={t('finance.weeksFromAth')}
                value={(calculateDays(btcStats.athDate) / 7).toFixed(1)}
              />
              <StatTile
                label={t('finance.weeksFromBottom')}
                value={(calculateDays('2022-11-21') / 7).toFixed(1)}
              />
              <StatTile
                label={t('finance.weeksToHalving')}
                value={((calculateDays('2024-04-26') / 7) * -1).toFixed(1)}
              />
            </Box>
          )
        )}
      </FoodPageHeader>

      {isError ? (
        <ErrorAlert error={error} />
      ) : (
        <Box component="section" sx={surfaceSx}>
          <Box sx={{ px: 2, py: 1.5, borderBottom: HAIRLINE }}>
            <Typography component="h2" sx={{ fontWeight: 500 }}>
              {t('finance.cryptoTable')}
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ px: 2, py: 1 }}>
              {COIN_LIST.map((symbol) => (
                <Skeleton key={symbol} height={40} />
              ))}
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" sx={financeTableSx}>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>{t('finance.name')}</TableCell>
                    <TableCell align="right">{t('finance.price')}</TableCell>
                    <TableCell align="right">24h</TableCell>
                    <TableCell align="right">7d</TableCell>
                    <TableCell align="right">30d</TableCell>
                    <TableCell align="right">90d</TableCell>
                    <TableCell>{t('finance.athDate')}</TableCell>
                    <TableCell align="right">ATH</TableCell>
                    <TableCell align="right">{t('finance.fromAth')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cryptoData &&
                    cryptoDescription &&
                    COIN_LIST.filter(
                      (symbol) => cryptoData[symbol] && cryptoDescription[symbol]
                    ).map((symbol) => (
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
          )}
        </Box>
      )}
    </Box>
  );
}
