import React from 'react';
import { useTranslation } from 'react-i18next';

import ChartGrid from './ChartGrid';
import { TV_STYLE } from './TradingViewChart';

// TradingView symbols for perpetual derivatives data (suffix .P = perpetual contract):
// _OI = open interest, _FR = funding rate. Binance perps are quoted in USDT, Coinbase in USDC.
const EXCHANGES = [
  { name: 'Binance', contract: (coin) => `BINANCE:${coin}USDT.P` },
  { name: 'Coinbase', contract: (coin) => `COINBASE:${coin}USDC.P` },
];

const METRICS = [
  {
    key: 'OI',
    titleKey: 'finance.live.openInterest',
    // TradingView publishes OI in coins; multiplying by the contract price (a TradingView
    // symbol expression) turns it into a USDT value.
    symbol: (contract) => `${contract}_OI*${contract}`,
  },
  { key: 'FR', titleKey: 'finance.live.fundingRate', symbol: (contract) => `${contract}_FR` },
];

/**
 * Open interest and funding rate as TradingView widgets, one chart per exchange:
 * rows are metrics, columns are exchanges. History, zoom and range come from the widget.
 */
export default function DerivativesCharts({ coin }) {
  const { t } = useTranslation();

  const charts = METRICS.flatMap((metric) =>
    EXCHANGES.map((exchange) => ({
      key: `${metric.key}-${exchange.name}`,
      title: t(metric.titleKey),
      subtitle: exchange.name,
      symbol: metric.symbol(exchange.contract(coin)),
      chartStyle: TV_STYLE.line,
      hideVolume: true,
    }))
  );

  return <ChartGrid charts={charts} />;
}
