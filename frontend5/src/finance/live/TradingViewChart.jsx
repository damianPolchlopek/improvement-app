import React from 'react';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import useTradingViewEmbed from './useTradingViewEmbed';

// TradingView chart styles used here: 1 = candles, 2 = line.
export const TV_STYLE = { candles: '1', line: '2' };

/**
 * Embeds TradingView's free "Advanced Chart" widget. The widget brings its own history,
 * zoom, range and interval controls, so no data fetching is needed on our side.
 */
export default function TradingViewChart({
  symbol,
  height = 420,
  chartStyle = TV_STYLE.candles,
  hideVolume = false,
}) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith('pl') ? 'pl' : 'en';

  const containerRef = useTradingViewEmbed('embed-widget-advanced-chart.js', {
    autosize: true,
    symbol,
    // Daily points by default. No `range` on purpose: a preset range overrides the interval
    // (6M picked 2h bars) and scrolls symbol-expression charts into the future.
    interval: 'D',
    timezone: 'Etc/UTC',
    theme: theme.palette.mode,
    style: chartStyle,
    locale,
    allow_symbol_change: true,
    hide_side_toolbar: true,
    hide_volume: hideVolume,
    save_image: false,
    support_host: 'https://www.tradingview.com',
  });

  // With autosize the widget sizes its container to 100% of the parent, so the fixed
  // height has to live on a wrapper rather than on the container itself.
  return (
    <div style={{ height, width: '100%' }}>
      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
