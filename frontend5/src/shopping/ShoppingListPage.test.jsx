import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '../language/i18n';

import REST from '../utils/REST';
import SnackbarProvider from '../component/snackbar/SnackbarProvider';
import ShoppingListPage from './ShoppingListPage';

vi.mock('../utils/REST', async () => {
  const { QueryClient } = await import('@tanstack/react-query');
  return {
    queryClient: new QueryClient(),
    default: {
      getAllCategoryProducts: vi.fn(),
      getShoppingListByCategory: vi.fn(),
      addProductToShoppingList: vi.fn(),
      deleteProductFromShoppingList: vi.fn(),
    },
  };
});

const ITEMS = [
  { id: 1, name: 'Mleko', category: 'GROCERY' },
  { id: 2, name: 'Ibuprofen', category: 'PHARMACY' },
];

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <SnackbarProvider>
        <ShoppingListPage />
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

describe('ShoppingListPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
    REST.getAllCategoryProducts.mockResolvedValue(['ALL', 'GROCERY', 'PHARMACY']);
    REST.getShoppingListByCategory.mockImplementation(async (category) =>
      category === 'ALL' ? ITEMS : ITEMS.filter((item) => item.category === category)
    );
    REST.deleteProductFromShoppingList.mockResolvedValue({});
    REST.addProductToShoppingList.mockResolvedValue({});
  });

  it('lists all items with their categories and filters by category chips', async () => {
    renderPage();

    const milk = (await screen.findByRole('cell', { name: 'Mleko' })).closest('tr');
    expect(within(milk).getByText('Sklep spożywczy')).toBeInTheDocument();
    expect(screen.getByText('· 2 produkty')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Apteka' }));

    expect(await screen.findByText('· 1 produkt')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Ibuprofen' })).toBeInTheDocument();
    // W konkretnej kategorii kolumna kategorii jest zbędna
    expect(screen.queryByRole('columnheader', { name: 'Kategoria' })).not.toBeInTheDocument();
  });

  it('checks an item off the list without confirmation', async () => {
    renderPage();

    const milk = (await screen.findByRole('cell', { name: 'Mleko' })).closest('tr');
    fireEvent.click(within(milk).getByRole('button', { name: 'Kupione – usuń z listy' }));

    await waitFor(() => expect(REST.deleteProductFromShoppingList).toHaveBeenCalledWith(1));
  });

  it('adds a product to the selected category', async () => {
    renderPage();
    await screen.findByRole('cell', { name: 'Mleko' });

    fireEvent.click(screen.getByRole('button', { name: 'Apteka' }));
    fireEvent.change(screen.getByPlaceholderText('Nazwa produktu...'), {
      target: { value: 'Witamina D' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Dodaj' }));

    await waitFor(() =>
      expect(REST.addProductToShoppingList).toHaveBeenCalledWith({
        name: 'Witamina D',
        category: 'PHARMACY',
      })
    );
  });
});
