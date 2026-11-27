import React from 'react';
import { Box, Typography } from '@mui/material';

import { HAIRLINE } from '../../food/component/foodStyles';

import TradingViewChart, { TV_STYLE } from './TradingViewChart';

const CHART_HEIGHT = 360;

// Płaska karta wykresu: ciemniejsze tło i cienka ramka (jak wnętrza kart w module food).
export const chartCardSx = {
  borderRadius: 2,
  overflow: 'hidden',
  bgcolor: 'rgba(0,0,0,0.15)',
  border: HAIRLINE,
};

function ChartCard({ title, subtitle, children }) {
  return (
    <Box sx={chartCardSx}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, px: 2, py: 1 }}>
        <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}

/**
 * Grid of titled TradingView charts: two columns on wide screens by default, or stacked
 * with columns={1}. Always one column on narrow screens.
 * charts: [{ key, title, subtitle?, symbol, chartStyle?, hideVolume? }]
 */
export default function ChartGrid({ charts, columns = 2 }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', lg: columns === 1 ? '1fr' : '1fr 1fr' },
      }}
    >
      {charts.map((chart) => (
        <ChartCard key={chart.key} title={chart.title} subtitle={chart.subtitle}>
          <TradingViewChart
            symbol={chart.symbol}
            chartStyle={chart.chartStyle ?? TV_STYLE.candles}
            hideVolume={chart.hideVolume ?? false}
            height={CHART_HEIGHT}
          />
        </ChartCard>
      ))}
    </Box>
  );
}
