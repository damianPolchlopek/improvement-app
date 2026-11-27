import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import i18n from '../language/i18n';

import REST from '../utils/REST';
import DietAuditSelectorPage from './components/DietAuditSelectorPage';
import DietAuditPage from './components/DietAuditPage';
import { REVISION_TYPES, formatRevisionType } from './utils/auditFormatters';

vi.mock('../utils/REST', async () => {
  const { QueryClient } = await import('@tanstack/react-query');
  return {
    queryClient: new QueryClient(),
    default: {
      getDietSummaries: vi.fn(),
      getRevisions: vi.fn(),
      getRevisionDetails: vi.fn(),
      getRevisionComparsion: vi.fn(),
    },
  };
});

const meal = (id, name, kcal) => ({
  id,
  name,
  portionMultiplier: 1,
  cachedKcal: kcal,
  cachedProtein: 30,
  cachedCarbohydrates: 50,
  cachedFat: 10,
  ingredients: [],
});

const summary = (meals) => ({
  id: 7,
  date: '26-11-2026',
  kcal: 1800,
  protein: 120,
  carbohydrates: 200,
  fat: 60,
  meals,
});

const REVISIONS = [
  {
    revisionNumber: 3,
    revisionType: 'MOD',
    revisionTimestamp: '2026-11-26T18:30:00',
    dietSummary: summary([meal(1, 'Owsianka', 500), meal(2, 'Kurczak z ryżem', 700)]),
  },
  {
    revisionNumber: 1,
    revisionType: 'ADD',
    revisionTimestamp: '2026-11-26T08:00:00',
    dietSummary: summary([meal(1, 'Owsianka', 500)]),
  },
];

const change = (oldValue, newValue) => ({
  oldValue,
  newValue,
  diff: newValue - oldValue,
  percentChange: ((newValue - oldValue) / oldValue) * 100,
});

function renderAt(path) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(
    [
      { path: '/app/audit', element: <DietAuditSelectorPage /> },
      { path: '/app/audit/:dietSummaryId', element: <DietAuditPage /> },
    ],
    { initialEntries: [path] }
  );
  return render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

describe('diet audit views', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
    REST.getRevisions.mockResolvedValue(REVISIONS);
  });

  it('lists diet summaries and opens the change history of a clicked row', async () => {
    REST.getDietSummaries.mockResolvedValue({
      totalElements: 1,
      content: [summary([meal(1, 'Owsianka', 500)])],
    });

    renderAt('/app/audit');

    const row = (await screen.findByText('26-11-2026')).closest('tr');
    expect(within(row).getByText('1800')).toBeInTheDocument();
    expect(within(row).getByText('120 g')).toBeInTheDocument();

    fireEvent.click(row);

    expect(await screen.findByText('Historia Zmian')).toBeInTheDocument();
    expect(REST.getRevisions).toHaveBeenCalledWith('7');
  });

  it('expands a revision on the timeline and filters revisions by change type', async () => {
    REST.getRevisionDetails.mockResolvedValue(REVISIONS[0]);

    renderAt('/app/audit/7');

    fireEvent.click(await screen.findByRole('button', { name: /Rewizja #3/ }));
    expect(await screen.findByText('Kurczak z ryżem')).toBeInTheDocument();
    expect(REST.getRevisionDetails).toHaveBeenCalledWith('7', 3);

    fireEvent.click(screen.getByRole('button', { name: 'Dodano' }));
    expect(screen.queryByRole('button', { name: /Rewizja #3/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rewizja #1/ })).toBeInTheDocument();
  });

  it('compares two selected revisions', async () => {
    REST.getRevisionComparsion.mockResolvedValue({
      olderRevision: REVISIONS[1],
      newerRevision: REVISIONS[0],
      macroChanges: {
        kcal: change(500, 1200),
        protein: change(30, 60),
        carbohydrates: change(50, 100),
        fat: change(10, 20),
      },
      mealsAdded: [meal(2, 'Kurczak z ryżem', 700)],
      mealsRemoved: [],
      mealsModified: [],
    });

    renderAt('/app/audit/7');

    fireEvent.click(await screen.findByRole('button', { name: /Porównaj wersje/ }));
    fireEvent.click(screen.getByRole('button', { name: /#1/ }));
    fireEvent.click(screen.getByRole('button', { name: /#3/ }));

    expect(await screen.findByText('Porównanie wersji')).toBeInTheDocument();
    expect(screen.getByText('+700.0 (140.0%)')).toBeInTheDocument();
    expect(screen.getByText('Dodane posiłki (1)')).toBeInTheDocument();
    expect(screen.getByText('Kurczak z ryżem')).toBeInTheDocument();
  });

  // Vitest nie zgłasza błędu przy imporcie nieistniejącej ikony (dostaje undefined),
  // a Vite w przeglądarce już tak – pilnujemy, żeby każdy typ miał prawdziwy komponent.
  it.each([...Object.keys(REVISION_TYPES), 'UNKNOWN'])(
    'has an icon for revision type %s',
    (type) => {
      expect(formatRevisionType(type).Icon).toBeTruthy();
    }
  );
});
