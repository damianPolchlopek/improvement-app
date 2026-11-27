import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import i18n from '../language/i18n';

import REST from '../utils/REST';
import ExerciseView from './exerciseView/ExerciseView';
import MaximumExerciseView from './maximumTrainingView/MaximumExerciseView';
import TrainingTemplatesView from './trainingTemplates/TrainingTemplatesView';
import TrainingStatistic from './trainingStatistic/TrainingStatistics';

vi.mock('../utils/REST', async () => {
  const { QueryClient } = await import('@tanstack/react-query');
  return {
    queryClient: new QueryClient(),
    default: {
      getTrainingByType: vi.fn(),
      getTrainingTemplate: vi.fn(),
      getATHTraining: vi.fn(),
      getAllTrainingTemplates: vi.fn(),
      getTrainingStatistic: vi.fn(),
    },
  };
});

function renderWithProviders(element, loader) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter([{ path: '/', element, loader }], { initialEntries: ['/'] });
  return render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

const exercise = (id, name, reps, weight, date) => ({ id, name, reps, weight, date });

describe('training views', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
  });

  it('ExerciseView shows sessions with set pills and the change vs the previous session', async () => {
    REST.getTrainingTemplate.mockResolvedValue({ exercises: ['Przysiad', 'Wiosłowanie'] });
    REST.getTrainingByType.mockResolvedValue({
      totalElements: 2,
      content: [
        {
          date: '2026-11-24',
          exercises: {
            Przysiad: exercise(1, 'Przysiad', '5/5', '100/110', '2026-11-24'),
          },
        },
        {
          date: '2026-11-17',
          exercises: {
            Przysiad: exercise(2, 'Przysiad', '5/5', '100/100', '2026-11-17'),
            Wiosłowanie: exercise(3, 'Wiosłowanie', '8/8', '60/60', '2026-11-17'),
          },
        },
      ],
    });

    renderWithProviders(<ExerciseView />);

    expect(await screen.findByText('24.11.2026')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Wiosłowanie' })).toBeInTheDocument();
    // Średnio 105 kg vs 100 kg w starszej sesji -> ▲ 5 kg
    expect(screen.getByText('5 kg')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Kettle K1' }));
    expect(REST.getTrainingByType).toHaveBeenLastCalledWith('K1', 0, 10);
  });

  it('MaximumExerciseView lists records in a table with the heaviest set', async () => {
    REST.getATHTraining.mockResolvedValue({
      content: [exercise(1, 'Martwy ciąg', '5/3/1', '120/130/140', '2026-10-02')],
    });

    renderWithProviders(<MaximumExerciseView />);

    const row = (await screen.findByRole('cell', { name: 'Martwy ciąg' })).closest('tr');
    expect(within(row).getByText('02.10.2026')).toBeInTheDocument();
    expect(within(row).getByText('140 kg')).toBeInTheDocument();
    expect(within(row).getAllByText('×')).toHaveLength(3);
    expect(screen.getByRole('columnheader', { name: 'Najcięższa seria' })).toBeInTheDocument();
  });

  it('TrainingTemplatesView groups templates, expands exercises and searches', async () => {
    REST.getAllTrainingTemplates.mockResolvedValue({
      content: [
        { id: 1, name: 'Siłowy#1-A', exercises: ['Przysiad', 'Wyciskanie'] },
        { id: 2, name: 'Kettle#1-K1', exercises: ['Swing'] },
      ],
    });

    renderWithProviders(<TrainingTemplatesView />);

    expect(await screen.findByRole('heading', { name: 'Siłowy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Kettle' })).toBeInTheDocument();

    const row = screen.getByRole('button', { name: /Siłowy#1-A/ });
    expect(row).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Przysiad')).not.toBeInTheDocument();
    fireEvent.click(row);
    expect(row).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByText('Przysiad')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Szukaj szablonu lub ćwiczenia'), {
      target: { value: 'swing' },
    });
    expect(screen.getByRole('button', { name: /Kettle#1-K1/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Siłowy#1-A/ })).not.toBeInTheDocument();
  });

  it('TrainingStatistic marks the active range preset and reloads with the new range', async () => {
    REST.getTrainingStatistic.mockResolvedValue([]);

    renderWithProviders(<TrainingStatistic />, () => ['Przysiad']);

    const all = await screen.findByRole('button', { name: 'Całość' });
    expect(all).toHaveAttribute('aria-pressed', 'true');
    expect(
      await screen.findByText('Brak danych dla wybranych ćwiczeń i zakresu.')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '3M' }));
    expect(screen.getByRole('button', { name: '3M' })).toHaveAttribute('aria-pressed', 'true');
    expect(all).toHaveAttribute('aria-pressed', 'false');
    expect(REST.getTrainingStatistic).toHaveBeenCalledTimes(2);
    expect(
      within(screen.getByRole('group', { name: 'Typ wykresu' })).getByRole('button', {
        name: 'Objętość',
      })
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
