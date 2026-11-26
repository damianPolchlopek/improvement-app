import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import dayjs from 'dayjs';
import i18n from '../language/i18n';

import REST from '../utils/REST';
import SnackbarProvider from '../component/snackbar/SnackbarProvider';
import HomeView from './HomeView';

vi.mock('../utils/REST', async () => {
  const { QueryClient } = await import('@tanstack/react-query');
  return {
    queryClient: new QueryClient(),
    default: {
      getDashboardSummary: vi.fn(),
      initTrainingModule: vi.fn(),
      initFoodModule: vi.fn(),
      addDaily: vi.fn(),
      addRecordToWeeklyList: vi.fn(),
    },
  };
});

// Log korzysta z WebSocketu – w teście niepotrzebny.
vi.mock('./LogComponent', () => ({ default: () => <div>log</div> }));

function renderView() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter([{ path: '/', element: <HomeView /> }], {
    initialEntries: ['/'],
  });
  return render(
    <QueryClientProvider client={client}>
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

describe('HomeView', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
  });

  it('shows the day progress in the header and an action only for due modules', async () => {
    const today = dayjs().format('YYYY-MM-DD');
    REST.getDashboardSummary.mockResolvedValue({
      lastDietDay: today,
      lastTraining: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      lastDaily: null,
      lastWeekly: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
      dietDays: [today],
      trainingDays: [],
      dailyDays: [],
      weeklyDays: [],
    });

    renderView();

    // Dieta (dziś) i trening (rytm 3 dni) zrobione; daily i weekly zaległe.
    expect(await screen.findByText('2/4')).toBeInTheDocument();
    expect(screen.getByText('2 z 4 na dziś')).toBeInTheDocument();

    const diet = screen.getByRole('region', { name: 'Jedzenie' });
    expect(within(diet).getByText('Zapisane dzisiaj')).toBeInTheDocument();
    expect(within(diet).queryByRole('link')).not.toBeInTheDocument();
    expect(within(diet).getByText('Na dziś nic do zrobienia')).toBeInTheDocument();

    const weekly = screen.getByRole('region', { name: 'Weekly' });
    expect(within(weekly).getByRole('button', { name: 'Zapisz wagę' })).toBeInTheDocument();

    expect(screen.getByText('Ostatnie 35 dni')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Zainicjuj treningi/ })).toBeInTheDocument();
  });
});
