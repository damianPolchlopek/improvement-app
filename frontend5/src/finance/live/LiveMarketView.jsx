import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Sensors } from '@mui/icons-material';

import REST from '../../utils/REST';
import TradingViewChart from './TradingViewChart';
import TradingViewTickers from './TradingViewTickers';
import DerivativesCharts from './DerivativesCharts';
import CollapsibleSection from './CollapsibleSection';
import UsdtZoneBar from './UsdtZoneBar';
import ChartGrid, { chartCardSx } from './ChartGrid';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import { surfaceSx } from '../../tokens';

// Live quotes in the top bar, all from TradingView's "Tickers" widget so they share one style
// (FOREXCOM index CFDs stand in for the S&P 500 and Nasdaq 100, which free widgets lack).
const TOP_TICKERS = [
  { proName: 'BINANCE:BTCUSDT', title: 'BTC' },
  { proName: 'BINANCE:ETHUSDT', title: 'ETH' },
  { proName: 'CRYPTOCAP:USDT.D', titleKey: 'finance.live.usdtDominance' },
  { proName: 'OANDA:XAUUSD', titleKey: 'finance.live.gold' },
  { proName: 'OANDA:XAGUSD', titleKey: 'finance.live.silver' },
  { proName: 'FOREXCOM:SPXUSD', titleKey: 'finance.live.sp500' },
  { proName: 'FOREXCOM:NSXUSD', titleKey: 'finance.live.nasdaq' },
  { proName: 'TVC:USOIL', titleKey: 'finance.live.oil' },
];
// The widget doesn't wrap (it hides tickers that don't fit), so the bar is split into rows.
const TICKERS_PER_ROW = 4;

const DERIVATIVE_COINS = ['BTC', 'ETH'];

// Spot price charts (TradingView symbols). OANDA spot metals work in the free widget.
const CRYPTO_CHARTS = [
  { key: 'btc', title: 'BTC', subtitle: 'BTC/USDT · Binance', symbol: 'BINANCE:BTCUSDT' },
  { key: 'eth', title: 'ETH', subtitle: 'ETH/USDT · Binance', symbol: 'BINANCE:ETHUSDT' },
];
// Market dominance (share of total crypto market cap), TradingView CRYPTOCAP indices.
const DOMINANCE_CHARTS = [
  {
    key: 'btcD',
    titleKey: 'finance.live.btcDominance',
    subtitle: 'BTC.D',
    symbol: 'CRYPTOCAP:BTC.D',
  },
  {
    key: 'othersD',
    titleKey: 'finance.live.othersDominance',
    subtitle: 'OTHERS.D',
    symbol: 'CRYPTOCAP:OTHERS.D',
  },
];
const INDEX_CHARTS = [
  { key: 'sp500', titleKey: 'finance.live.sp500', subtitle: 'SPX', symbol: 'FOREXCOM:SPXUSD' },
  { key: 'nasdaq', titleKey: 'finance.live.nasdaq', subtitle: 'NDX', symbol: 'FOREXCOM:NSXUSD' },
];
const METAL_CHARTS = [
  { key: 'gold', titleKey: 'finance.live.gold', subtitle: 'XAU/USD', symbol: 'OANDA:XAUUSD' },
  { key: 'silver', titleKey: 'finance.live.silver', subtitle: 'XAG/USD', symbol: 'OANDA:XAGUSD' },
];

export default function LiveMarketView() {
  const { t } = useTranslation();
  const [coin, setCoin] = useState('BTC');

  const tickerRows = [];
  for (let i = 0; i < TOP_TICKERS.length; i += TICKERS_PER_ROW) {
    tickerRows.push(
      TOP_TICKERS.slice(i, i + TICKERS_PER_ROW).map(({ proName, title, titleKey }) => ({
        proName,
        title: title ?? t(titleKey),
      }))
    );
  }

  // Current USDT dominance for the zone bar, from the existing CoinMarketCap proxy
  // (quotes/latest returns market_cap_dominance per coin). Refreshed slowly to respect
  // CMC's free quota.
  const { data: usdtResponse } = useQuery({
    queryKey: ['crypto-prices', 'USDT'],
    queryFn: () => REST.getFinanceCryptoPrice('USDT', 'USD'),
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 10,
  });
  const usdtDominance = (usdtResponse?.data || usdtResponse)?.USDT?.quote?.USD
    ?.market_cap_dominance;

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1400, mx: 'auto' }}>
      <FoodPageHeader
        icon={<Sensors />}
        title={t('finance.live.title')}
        description={t('finance.live.description')}
        statLabel={t('finance.live.usdtDominance')}
        statValue={typeof usdtDominance === 'number' ? `${usdtDominance.toFixed(2)}%` : '—'}
      />

      <Box sx={{ display: 'grid', gap: 2 }}>
        {/* Live quotes */}
        <Box sx={{ ...surfaceSx, px: 2.5, py: 1.5, display: 'grid', gap: 1 }}>
          {tickerRows.map((symbols) => (
            <TradingViewTickers key={symbols[0].proName} symbols={symbols} />
          ))}
        </Box>

        <CollapsibleSection id="crypto" title={t('finance.live.crypto')}>
          <ChartGrid charts={CRYPTO_CHARTS} />
        </CollapsibleSection>

        <CollapsibleSection id="macro" title={t('finance.live.macro')}>
          <Box sx={chartCardSx}>
            <Typography sx={{ fontWeight: 500, px: 2, py: 1, textAlign: 'left' }}>
              {t('finance.live.usdtDominance')}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 240px' },
                gap: 2,
                pr: { md: 2 },
                pb: { xs: 2, md: 0 },
              }}
            >
              <TradingViewChart symbol="CRYPTOCAP:USDT.D" />
              <Box sx={{ px: { xs: 2, md: 0 } }}>
                <UsdtZoneBar value={usdtDominance} />
              </Box>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <ChartGrid
              columns={1}
              charts={DOMINANCE_CHARTS.map((c) => ({ ...c, title: t(c.titleKey) }))}
            />
          </Box>
        </CollapsibleSection>

        <CollapsibleSection
          id="derivatives"
          title={t('finance.live.derivatives')}
          actions={
            <ToggleButtonGroup
              size="small"
              exclusive
              value={coin}
              onChange={(_, value) => value && setCoin(value)}
            >
              {DERIVATIVE_COINS.map((c) => (
                <ToggleButton key={c} value={c} sx={{ px: 1.5 }}>
                  {c}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          }
        >
          <DerivativesCharts coin={coin} />
        </CollapsibleSection>

        <CollapsibleSection id="indices" title={t('finance.live.indices')}>
          <ChartGrid
            columns={1}
            charts={INDEX_CHARTS.map((c) => ({ ...c, title: t(c.titleKey) }))}
          />
        </CollapsibleSection>

        <CollapsibleSection id="metals" title={t('finance.live.metals')}>
          <ChartGrid charts={METAL_CHARTS.map((c) => ({ ...c, title: t(c.titleKey) }))} />
        </CollapsibleSection>
      </Box>
    </Box>
  );
}
