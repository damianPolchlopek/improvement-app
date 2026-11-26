import React from 'react';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import useTradingViewEmbed from './useTradingViewEmbed';

/**
 * TradingView's free "Tickers" widget: a single row of live quotes (price + daily change)
 * for markets Binance doesn't cover, such as metals, indices and oil.
 * symbols: [{ proName: 'OANDA:XAUUSD', title: 'Gold' }]
 */
export default function TradingViewTickers({ symbols }) {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith('pl') ? 'pl' : 'en';

  const containerRef = useTradingViewEmbed('embed-widget-tickers.js', {
    symbols,
    isTransparent: true,
    showSymbolLogo: true,
    colorTheme: theme.palette.mode,
    locale,
  });

  return (
    <div ref={containerRef} className="tradingview-widget-container" style={{ width: '100%' }} />
  );
}
