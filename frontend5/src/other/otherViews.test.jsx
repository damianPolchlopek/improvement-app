import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '../language/i18n';

import REST from '../utils/REST';
import SnackbarProvider from '../component/snackbar/SnackbarProvider';
import DailyView from './daily/DailyView';
import WeeklyRecordsView from './weekly/WeeklyRecordsView';

vi.mock('../utils/REST', async () => {
  const { QueryClient } = await import('@tanstack/react-query');
  return {
    queryClient: new QueryClient(),
    default: {
      getDaily: vi.fn(),
      addDaily: vi.fn(),
      deleteDaily: vi.fn(),
      getAllCategoryWeeklyRecords: vi.fn(),
      getWeeklyListByCategory: vi.fn(),
      addRecordToWeeklyList: vi.fn(),
      deleteProductFromWeeklyList: vi.fn(),
    },
  };
});

function renderWithProviders(element) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <SnackbarProvider>{element}</SnackbarProvider>
    </QueryClientProvider>
  );
}

describe('other module views', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
  });

  it('DailyView shows history with habit marks and score, and saves selected habits', async () => {
    REST.getDaily.mockResolvedValue({
      totalElements: 1,
      content: [
        { id: 1, date: '26-11-2026', health: true, exercise: false, book: true, software: true },
      ],
    });
    REST.addDaily.mockResolvedValue({});

    renderWithProviders(<DailyView />);

    const row = (await screen.findByText('26-11-2026')).closest('tr');
    expect(within(row).getByText('czwartek')).toBeInTheDocument();
    expect(within(row).getByText('3/4')).toBeInTheDocument();
    expect(within(row).getAllByLabelText('✓')).toHaveLength(3);

    fireEvent.click(screen.getByRole('button', { name: 'Zdrowie' }));
    fireEvent.click(screen.getByRole('button', { name: 'Książka' }));
    expect(screen.getByText('2/4')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz dzień' }));

    await waitFor(() =>
      expect(REST.addDaily).toHaveBeenCalledWith(
        expect.objectContaining({ health: true, book: true, exercise: false, software: false })
      )
    );
  });

  it('DailyView asks before deleting an entry', async () => {
    REST.getDaily.mockResolvedValue({
      totalElements: 1,
      content: [{ id: 7, date: '26-11-2026', health: true }],
    });
    REST.deleteDaily.mockResolvedValue({});

    renderWithProviders(<DailyView />);

    fireEvent.click(await screen.findByRole('button', { name: 'Usuń' }));
    expect(REST.deleteDaily).not.toHaveBeenCalled();
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Usuń' }));
    await waitFor(() => expect(REST.deleteDaily).toHaveBeenCalledWith(7));
  });

  it('WeeklyRecordsView switches categories with chips and lists records', async () => {
    REST.getAllCategoryWeeklyRecords.mockResolvedValue(['Waga', 'Książki']);
    REST.getWeeklyListByCategory.mockImplementation(async (category) =>
      category === 'Waga'
        ? [{ id: 1, name: '82.5', category: 'Waga', date: '20-11-2026' }]
        : [{ id: 2, name: 'Diuna', category: 'Książki', date: '01-11-2026' }]
    );

    renderWithProviders(<WeeklyRecordsView />);

    expect(await screen.findByRole('cell', { name: '82.5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Waga' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Książki' }));

    expect(await screen.findByRole('cell', { name: 'Diuna' })).toBeInTheDocument();
    expect(REST.getWeeklyListByCategory).toHaveBeenCalledWith('Książki');
    expect(screen.getByText('· 1 rekord')).toBeInTheDocument();
  });
});
