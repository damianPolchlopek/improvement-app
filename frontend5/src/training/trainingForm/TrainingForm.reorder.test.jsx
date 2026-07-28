import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import TrainingForm from './TrainingForm';

const loaderData = {
  exerciseNames: [{ name: 'Wyciskanie sztangi' }, { name: 'Przysiad' }],
  exercisePlaces: [],
  exerciseProgresses: [],
  exerciseTypes: [],
};

const exercises = [
  { id: 1, name: 'Wyciskanie sztangi', type: '', place: '', progress: '', reps: '1', weight: '10' },
  { id: 2, name: 'Przysiad', type: '', place: '', progress: '', reps: '2', weight: '20' },
];

function renderForm() {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        loader: () => loaderData,
        element: <TrainingForm exercises={exercises} isSimpleForm={true} />,
      },
    ],
    { initialEntries: ['/'] }
  );

  return render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

describe('TrainingForm reorder (Alt+ArrowDown)', () => {
  it('moves the focused row down with Alt+ArrowDown', async () => {
    renderForm();

    let repsInputs = await screen.findAllByPlaceholderText('5/5/5/5/5');
    expect(repsInputs.map((i) => i.value)).toEqual(['1', '2']);

    // Kursor w polu powtórzeń pierwszego wiersza, następnie Alt+ArrowDown
    repsInputs[0].focus();
    fireEvent.keyDown(repsInputs[0], { key: 'ArrowDown', altKey: true });

    repsInputs = await screen.findAllByPlaceholderText('5/5/5/5/5');
    expect(repsInputs.map((i) => i.value)).toEqual(['2', '1']);
  });

  it('reorders even when focus is in the name (Autocomplete) field', async () => {
    renderForm();

    const nameInput = await screen.findByDisplayValue('Wyciskanie sztangi');
    nameInput.focus();
    fireEvent.keyDown(nameInput, { key: 'ArrowDown', altKey: true });

    const repsInputs = await screen.findAllByPlaceholderText('5/5/5/5/5');
    expect(repsInputs.map((i) => i.value)).toEqual(['2', '1']);
  });
});
