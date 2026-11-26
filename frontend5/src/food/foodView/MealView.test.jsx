import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '../../language/i18n';

import MealView from './MealView';
import REST from '../../utils/REST';

vi.mock('../../utils/REST', () => ({
  default: {
    getMealCategoryList: vi.fn(),
    getMealTypeList: vi.fn(),
    getMealList: vi.fn(),
    getMealIngredients: vi.fn(),
  },
}));

const meals = [
  {
    id: 1,
    name: 'Kurczak z ryżem i brokułem',
    kcal: 520,
    protein: 42,
    carbohydrates: 58,
    fat: 12,
    portionAmount: 1,
    url: 'https://example.com/kurczak',
    type: 'CHICKEN',
    recipe: ['Ugotuj ryż.', 'Podsmaż kurczaka.'],
  },
  {
    id: 2,
    name: 'Spaghetti bolognese',
    kcal: 640.4,
    protein: 35,
    carbohydrates: 72,
    fat: 22,
    portionAmount: 1,
    url: '',
    type: 'PORK',
    recipe: [],
  },
];

function renderView() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MealView />
    </QueryClientProvider>
  );
}

describe('MealView', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    REST.getMealCategoryList.mockResolvedValue(['All', 'Śniadanie', 'Obiad', 'Kolacja']);
    REST.getMealTypeList.mockResolvedValue(['All', 'Kurczak/Indyk']);
    REST.getMealList.mockResolvedValue(meals);
    REST.getMealIngredients.mockResolvedValue({
      MEAT: [{ id: 10, name: 'Pierś z kurczaka', amount: 150, unit: 'g' }],
      CARBS: [{ id: 11, name: 'Ryż basmati', amount: 70, unit: 'g' }],
    });
  });

  it('renders meal cards with kcal, macros and count', async () => {
    renderView();

    expect(await screen.findByText('Kurczak z ryżem i brokułem')).toBeInTheDocument();
    expect(screen.getByText('Spaghetti bolognese')).toBeInTheDocument();
    expect(screen.getByText('640')).toBeInTheDocument();
    const header = screen.getByRole('banner');
    expect(within(header).getByText('Posiłki').nextSibling).toHaveTextContent('2');
    expect(within(header).queryByText(/Śr\./)).not.toBeInTheDocument();
    expect(screen.getAllByText('Kurczak/Indyk').length).toBeGreaterThan(0);
  });

  it('switches category via chips', async () => {
    renderView();
    fireEvent.click(await screen.findByText('Kolacja'));

    await screen.findByText('Kurczak z ryżem i brokułem');
    expect(REST.getMealList).toHaveBeenLastCalledWith('Kolacja', 'All', '', 'ALL', 'name', false);
  });

  it('expands details inline in the grid and collapses on second click', async () => {
    renderView();
    fireEvent.click(await screen.findByText('Kurczak z ryżem i brokułem'));

    const panel = await screen.findByRole('region', { name: 'Kurczak z ryżem i brokułem' });
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    expect(await within(panel).findByText('Pierś z kurczaka')).toBeInTheDocument();
    expect(within(panel).getByText('Mięso')).toBeInTheDocument();
    expect(within(panel).getByText('Ugotuj ryż.')).toBeInTheDocument();
    expect(within(panel).getByRole('link', { name: /Zobacz przepis/ })).toHaveAttribute(
      'href',
      'https://example.com/kurczak'
    );

    // Na wąskim ekranie (jsdom) jest 1 kolumna, więc panel stoi zaraz za klikniętą kartą.
    const cards = screen.getAllByRole('button', { expanded: false });
    expect(panel.compareDocumentPosition(cards.at(-1)) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );

    fireEvent.click(screen.getAllByText('Kurczak z ryżem i brokułem')[0]);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('collapses the panel with Escape', async () => {
    renderView();
    fireEvent.click(await screen.findByText('Spaghetti bolognese'));
    await screen.findByRole('region');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});
