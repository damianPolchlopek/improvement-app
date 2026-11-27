import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '../language/i18n';

import REST from '../utils/REST';
import FinanceView from './view/FinanceView';
import FinanceInformation from './FinanceInformation';
import LiveMarketView from './live/LiveMarketView';
import { COIN_LIST } from './view/COIN_LIST';

vi.mock('../utils/REST', () => ({
  default: { getFinanceCryptoPrice: vi.fn(), getFinanceCryptoDescription: vi.fn() },
}));

// Widgety TradingView ładują zewnętrzne skrypty – w testach wystarczy znacznik.
vi.mock('./live/TradingViewChart', () => ({
  default: ({ symbol }) => <div data-testid="tv-chart">{symbol}</div>,
  TV_STYLE: { candles: '1', line: '2' },
}));
vi.mock('./live/TradingViewTickers', () => ({ default: () => <div data-testid="tv-tickers" /> }));

function renderWithClient(element) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{element}</QueryClientProvider>);
}

const coin = (rank, price, changes) => ({
  cmc_rank: rank,
  quote: {
    USD: {
      price,
      percent_change_24h: changes[0],
      percent_change_7d: changes[1],
      percent_change_30d: changes[2],
      percent_change_90d: changes[3],
      market_cap_dominance: 5.12,
    },
  },
});

describe('finance views', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('FinanceView shows prices with colored changes and skips coins without data', async () => {
    REST.getFinanceCryptoPrice.mockResolvedValue({
      data: { BTC: coin(1, 91234.5, [2.15, -3.4, 10, -20]) },
    });
    REST.getFinanceCryptoDescription.mockResolvedValue({
      BTC: { ath: 126000, athDate: '2025-10-06' },
    });

    renderWithClient(<FinanceView />);

    const row = (await screen.findByRole('cell', { name: 'BTC' })).closest('tr');
    expect(within(row).getByText('$91,234.50')).toBeInTheDocument();
    expect(within(row).getByText('2.15%')).toBeInTheDocument();
    expect(within(row).getAllByLabelText('▲')).toHaveLength(2);
    // 24h, 7d, 90d i "od ATH" są na minusie
    expect(within(row).getAllByLabelText('▼')).toHaveLength(3);
    // Pozostałe monety z COIN_LIST nie mają danych – nie wywracają tabeli
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText(String(COIN_LIST.length))).toBeInTheDocument();
    expect(screen.getByText('Tygodnie od ATH')).toBeInTheDocument();
  });

  it('FinanceInformation shows the cycles table and numbered notes', () => {
    renderWithClient(<FinanceInformation />);

    expect(screen.getByRole('columnheader', { name: '2021' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '78%' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(8);
  });

  it('LiveMarketView shows USDT dominance in the header and opens sections on demand', async () => {
    REST.getFinanceCryptoPrice.mockResolvedValue({ data: { USDT: coin(3, 1, [0, 0, 0, 0]) } });

    renderWithClient(<LiveMarketView />);

    expect(await screen.findByText('5.12%')).toBeInTheDocument();
    expect(screen.queryByTestId('tv-chart')).not.toBeInTheDocument();

    const crypto = screen.getByRole('button', { name: 'Kryptowaluty' });
    expect(crypto).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(crypto);
    expect(crypto).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('BINANCE:BTCUSDT')).toBeInTheDocument();
  });
});
