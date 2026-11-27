import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '../../language/i18n';

import REST from '../../utils/REST';
import AddTrainingView from './AddTrainingView';

vi.mock('../../utils/REST', async () => {
  const { QueryClient } = await import('@tanstack/react-query');
  return {
    queryClient: new QueryClient(),
    default: {
      getTrainingTemplateByType: vi.fn(),
      getLastExerciseByName: vi.fn(),
      addTraining: vi.fn(),
    },
  };
});

const loaderData = {
  exerciseNames: [{ name: 'Przysiad' }, { name: 'Wiosłowanie' }],
  exercisePlaces: [{ name: 'Siłownia' }],
  exerciseProgresses: [{ name: 'Zwiększyć' }],
  exerciseTypes: [{ name: 'Siłowy#1-A' }],
};

function renderView() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(
    [{ path: '/', loader: () => loaderData, element: <AddTrainingView /> }],
    { initialEntries: ['/'] }
  );
  return render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

describe('AddTrainingView', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
    REST.getTrainingTemplateByType.mockImplementation(async (type) => ({
      content:
        type === 'A'
          ? [{ id: 1, name: 'Przysiad', reps: '5/5/5', weight: '100/100/100', type: '', place: '' }]
          : [{ id: 2, name: 'Wiosłowanie', reps: '8/8', weight: '60/60', type: '', place: '' }],
    }));
  });

  it('loads the template of the chosen type from the chips', async () => {
    renderView();

    // Pierwszy render w pliku (lazy loader trasy + i18n) bywa wolniejszy niż domyślna 1 s.
    expect(
      await screen.findByDisplayValue('Wiosłowanie', {}, { timeout: 4000 })
    ).toBeInTheDocument();
    expect(REST.getTrainingTemplateByType).toHaveBeenCalledWith('F3A');
    expect(screen.getByRole('button', { name: 'FBW#3-A' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Siłowy A' }));

    expect(await screen.findByDisplayValue('Przysiad')).toBeInTheDocument();
    expect(REST.getTrainingTemplateByType).toHaveBeenCalledWith('A');
  }, 20000); // pierwszy render w pliku (lazy loader trasy + i18n) bywa wolny przy pełnym uruchomieniu

  it('shows the last result as set pills with the weight change while typing', async () => {
    renderView();
    fireEvent.click(await screen.findByRole('button', { name: 'Siłowy A' }));

    const weight = await screen.findByDisplayValue('100/100/100');
    fireEvent.change(weight, { target: { value: '100/105/110' } });

    // Średnio 105 kg vs 100 kg ostatnio -> ▲ 5 kg; poprzednie serie jako 5×100
    expect(await screen.findByText('5 kg')).toBeInTheDocument();
    expect(screen.getAllByText('×').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('ostatnio')).toBeInTheDocument();
  });

  it('switches to the advanced form mode', async () => {
    renderView();
    await screen.findByDisplayValue('Wiosłowanie');
    expect(screen.queryByLabelText('Miejsce')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tryb Zaawansowany' }));

    expect(await screen.findAllByText('Miejsce')).not.toHaveLength(0);
  });
});
