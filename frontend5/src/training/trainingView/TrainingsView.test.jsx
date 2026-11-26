import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '../../language/i18n';

import REST from '../../utils/REST';
import TrainingsView from './TrainingsView';
import { groupByWeek, isoWeek, parseTrainingName, typeGroup, typeLabel } from './trainingWeeks';

vi.mock('../../utils/REST', () => ({
  default: { getAllTrainingNames: vi.fn(), getExercises: vi.fn(), getExercisesByName: vi.fn() },
}));

// Format nazw jak z backendu (kod typu na końcu).
// 24.11.2026 i 28.11.2026 to tydzień 48, 16.11.2026 – tydzień 47.
const NAMES = ['413 - 28.11.2026r. - C', '412 - 24.11.2026r. - A', '410 - 16.11.2026r. - E'];

function renderView() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <TrainingsView />
    </QueryClientProvider>
  );
}

describe('TrainingsView (tydzień po tygodniu)', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
    REST.getAllTrainingNames.mockResolvedValue({ content: NAMES, totalElements: 3 });
    REST.getExercises.mockResolvedValue({
      content: [
        {
          id: 1,
          name: 'Przysiad',
          reps: '5/5/5',
          weight: '100/100/105',
          progress: 'Zwiększyć',
          place: 'Siłownia',
          date: '2026-11-24',
        },
      ],
    });
    // Historia ćwiczenia od najnowszych (zawiera też bieżące wykonanie).
    REST.getExercisesByName.mockResolvedValue({
      content: [
        { id: 1, name: 'Przysiad', reps: '5/5/5', weight: '100/100/105', date: '2026-11-24' },
        { id: 9, name: 'Przysiad', reps: '5/5', weight: '95/95', date: '2026-11-10' },
      ],
    });
  });

  it('groups trainings into weeks with headers', async () => {
    renderView();

    expect(await screen.findByRole('heading', { name: 'Tydzień 48' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tydzień 47' })).toBeInTheDocument();
    expect(screen.getByText(/2 treningi/)).toBeInTheDocument();
    expect(screen.getByText(/1 trening$/)).toBeInTheDocument();
  });

  it('expands a training to show exercises, progress, place and exercise history', async () => {
    renderView();

    const row = await screen.findByRole('button', { name: /Siłowy A/ });
    fireEvent.click(row);

    expect(row).toHaveAttribute('aria-expanded', 'true');
    expect(within(row).getByText('24.11.2026')).toBeInTheDocument();
    expect(
      await screen.findByRole('columnheader', { name: 'Serie (powt. × kg)' })
    ).toBeInTheDocument();
    expect(REST.getExercises).toHaveBeenCalledWith('412 - 24.11.2026r. - A');
    expect(await screen.findByText('Przysiad')).toBeInTheDocument();
    expect(screen.getByText('zwiększyć')).toBeInTheDocument();
    expect(screen.queryByText('Siłownia')).not.toBeInTheDocument();
    expect(screen.getAllByText('×')).toHaveLength(3);
    // Średnio (100+100+105)/3 ≈ 101,7 kg vs 95 kg poprzednio (10.11) -> ▲ 6,7 kg
    expect(await screen.findByText('6,7 kg')).toBeInTheDocument();
    expect(screen.getByLabelText('▲')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Przysiad'));
    expect(await screen.findByText('Historia: Przysiad')).toBeInTheDocument();
    expect(REST.getExercisesByName).toHaveBeenCalledWith('Przysiad');
    // W historii zmiana liczona względem wiersza niżej; najstarszy wpis nie ma porównania.
    expect(await screen.findByText('10.11.2026')).toBeInTheDocument();
    expect(screen.getAllByText('6,7 kg')).toHaveLength(1);
  });

  it('shows a decrease and no change', async () => {
    REST.getExercises.mockResolvedValue({
      content: [
        { id: 1, name: 'Przysiad', reps: '5/5/5', weight: '105/90/90', date: '2026-11-24' },
        { id: 2, name: 'Wiosłowanie', reps: '8/8', weight: '60/60', date: '2026-11-24' },
      ],
    });
    REST.getExercisesByName.mockImplementation(async (name) => ({
      content:
        name === 'Przysiad'
          ? [{ id: 9, name, reps: '5/5/5', weight: '100/100/105', date: '2026-11-10' }]
          : [{ id: 8, name, reps: '8/8', weight: '60/60', date: '2026-11-12' }],
    }));
    renderView();

    fireEvent.click(await screen.findByRole('button', { name: /Siłowy A/ }));

    // Maks. ciężar ten sam (105 kg), ale średnio 95 kg vs ≈101,7 kg -> ▼ 6,7 kg
    expect(await screen.findByText('6,7 kg')).toBeInTheDocument();
    expect(screen.getByLabelText('▼')).toBeInTheDocument();
    expect(await screen.findByText('=')).toBeInTheDocument();
  });

  it('filters trainings by type group', async () => {
    renderView();
    await screen.findByRole('heading', { name: 'Tydzień 48' });

    fireEvent.click(screen.getByRole('button', { name: 'Kardio i basen' }));

    const list = screen.getByRole('heading', { name: 'Tydzień 47' }).closest('section');
    expect(within(list).getByRole('button', { name: /Basen/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Siłowy A/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Tydzień 48' })).not.toBeInTheDocument();
  });

  it('shows strength trainings for the strength filter', async () => {
    renderView();
    await screen.findByRole('heading', { name: 'Tydzień 48' });

    fireEvent.click(screen.getByRole('button', { name: 'Siłowy' }));

    expect(screen.getByRole('button', { name: /Siłowy A/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Hipertroficzny C/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Basen/ })).not.toBeInTheDocument();
  });
});

describe('trainingWeeks', () => {
  it('parses names and maps types to groups', () => {
    const parsed = parseTrainingName('412 - 24.11.2026r. - Siłowy A');
    expect(parsed).toMatchObject({ number: '412', type: 'Siłowy A' });
    expect(parseTrainingName('Inny format').type).toBe('Inny format');
    expect(parseTrainingName('412 - 24.11.2026r. - K1').type).toBe('K1');
    expect(typeGroup('A').key).toBe('strength');
    expect(typeGroup('D').key).toBe('hypertrophy');
    expect(typeGroup('F2').key).toBe('fbw');
    expect(typeGroup('K3').key).toBe('kettle');
    expect(typeGroup('E').key).toBe('cardio');
    expect(typeLabel('A')).toBe('Siłowy A');
    expect(typeLabel('K1')).toBe('Kettle K1');
    expect(typeLabel('XYZ')).toBe('XYZ');
    expect(typeGroup('Siłowy B').key).toBe('strength');
    expect(typeGroup('FBW#3-A').key).toBe('fbw');
    expect(typeGroup('Rower').key).toBe('cardio');
  });

  it('computes ISO weeks and groups consecutive trainings', () => {
    expect(isoWeek(new Date(2026, 10, 24))).toBe(48);
    expect(isoWeek(new Date(2021, 0, 1))).toBe(53);
    const weeks = groupByWeek(NAMES.map(parseTrainingName));
    expect(weeks.map((w) => w.trainings.length)).toEqual([2, 1]);
  });
});
