import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import i18n from '../language/i18n';

import REST from '../utils/REST';
import SnackbarProvider from '../component/snackbar/SnackbarProvider';
import { MealSelectionProvider } from '../context/MealSelectionContext';
import ProductView from './ProductView/ProductView';
import DietStatisticView from './statistic/DietStatisticView';
import AddDietDayView from './addDietDay/AddDietDayView';

vi.mock('../utils/REST', async () => {
  const { QueryClient } = await import('@tanstack/react-query');
  return {
    queryClient: new QueryClient(),
    default: {
      getProductCategoryList: vi.fn(),
      getProductFiltredByCategoryAndName: vi.fn(),
      getDietSummaries: vi.fn(),
      deleteDietSummaries: vi.fn(),
      getMealList: vi.fn(),
      calculateDiet: vi.fn(),
      recalculateMeal: vi.fn(),
      createDietSummary: vi.fn(),
    },
  };
});

function renderWithProviders(element) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter([{ path: '/', element }], { initialEntries: ['/'] });
  return render(
    <QueryClientProvider client={client}>
      <SnackbarProvider>
        <MealSelectionProvider>
          <RouterProvider router={router} />
        </MealSelectionProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

describe('food module views', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
  });

  it('ProductView shows category chips, product count and colored rows', async () => {
    REST.getProductCategoryList.mockResolvedValue(['ALL', 'MEAT', 'DAIRY']);
    REST.getProductFiltredByCategoryAndName.mockResolvedValue([
      {
        id: 1,
        name: 'Pierś z kurczaka',
        kcal: 110,
        protein: 23,
        carbohydrates: 0,
        fat: 1.5,
        amount: 100,
        unit: 'g',
      },
    ]);

    renderWithProviders(<ProductView />);

    expect(await screen.findByText('Pierś z kurczaka')).toBeInTheDocument();
    const header = screen.getByRole('banner');
    expect(within(header).getByText('Produkty').nextSibling).toHaveTextContent('1');
    expect(within(header).getByText('Mięso')).toBeInTheDocument();
    expect(screen.getByText('100 g')).toBeInTheDocument();

    fireEvent.click(within(header).getByText('Nabiał'));
    await screen.findByText('Pierś z kurczaka');
    expect(REST.getProductFiltredByCategoryAndName).toHaveBeenLastCalledWith('DAIRY', ' ');
  });

  it('DietStatisticView lists days and expands meals', async () => {
    REST.getDietSummaries.mockResolvedValue({
      totalElements: 1,
      totalPages: 1,
      content: [
        {
          id: 7,
          date: '2026-11-20',
          kcal: 2450.4,
          protein: 160,
          carbohydrates: 250,
          fat: 80,
          meals: [
            {
              id: 1,
              name: 'Owsianka',
              kcal: 410,
              protein: 14,
              carbohydrates: 68,
              fat: 9,
              portionMultiplier: 1,
            },
          ],
        },
      ],
    });

    renderWithProviders(<DietStatisticView />);

    expect(await screen.findByText('20.11.2026')).toBeInTheDocument();
    expect(screen.getByText('2450')).toBeInTheDocument();
    expect(within(screen.getByRole('banner')).getByText('Dni').nextSibling).toHaveTextContent('1');

    fireEvent.click(screen.getByRole('button', { name: 'Pokaż posiłki' }));
    expect(await screen.findByText('Owsianka')).toBeInTheDocument();
  });

  it('AddDietDayView renders header, empty summary and meal categories', async () => {
    REST.getMealList.mockResolvedValue([]);

    renderWithProviders(<AddDietDayView />);

    expect(await screen.findByText('Dodaj dzień diety')).toBeInTheDocument();
    expect(screen.getByText('Zaznacz posiłki poniżej, aby zbudować dzień.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Zapisz|Save/ })).toBeDisabled();
    expect(screen.getByText(i18n.t('food.breakfast'))).toBeInTheDocument();
  });
});
