import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import i18n from '../language/i18n';
import theme from '../theme';
import Header from './Header';

const renderAt = (path) => {
  const router = createMemoryRouter(
    [{ path: '*', element: <Header onDrawerToggle={() => {}} /> }],
    {
      initialEntries: [path],
    }
  );
  render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

const currentLinks = () =>
  screen
    .getAllByRole('link')
    .filter((link) => link.getAttribute('aria-current') === 'page')
    .map((link) => link.textContent);

describe('Header', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
  });

  it('marks the active module and its sub-page, with "Add" as a quick action', () => {
    renderAt('/app/training/statistics');

    expect(currentLinks()).toEqual(['Trening', 'Statystyka']);
    const subNav = screen.getAllByRole('navigation')[1];
    expect(
      within(subNav)
        .getAllByRole('link')
        .map((link) => link.textContent)
    ).toEqual(['Widok', 'Ćwiczenia', 'Maksimum', 'Szablony', 'Statystyka', 'Dodaj']);
  });

  it('hides the sub-navigation for single-page modules like Home', () => {
    renderAt('/app/');

    expect(currentLinks()).toEqual(['Strona główna']);
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
  });
});
