import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import i18n from '../language/i18n';

import REST from '../utils/REST';
import LoginView, { action as loginAction } from './LoginView';
import SignUpView from './SignUpView';
import { HomeViewUrl } from '../utils/URLHelper';

vi.mock('../utils/REST', () => ({
  default: { loginUser: vi.fn(), registerUser: vi.fn(), resendVerificationEmail: vi.fn() },
}));
vi.mock('./Authentication', () => ({ setTokens: vi.fn() }));

function renderRoutes(initialPath) {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginView />, action: loginAction },
      { path: '/sign-up', element: <SignUpView /> },
      { path: '/app', element: <div>home page</div> },
    ],
    { initialEntries: [initialPath] }
  );
  render(<RouterProvider router={router} />);
  return router;
}

const fill = (label, value) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('login and sign-up views', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('pl');
    vi.clearAllMocks();
  });

  it('LoginView validates fields, signs in and redirects home', async () => {
    REST.loginUser.mockResolvedValue({ accessTokenExpiresAt: 1, refreshTokenExpiresAt: 2 });
    const router = renderRoutes('/login');

    expect(await screen.findByRole('heading', { name: 'Zaloguj się' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zarejestruj się' })).toHaveAttribute(
      'href',
      '/sign-up'
    );

    const username = screen.getByLabelText(/Nazwa użytkownika lub Email/);
    fireEvent.blur(username);
    expect(screen.getByText('Wprowadź prawidłowy login!')).toBeInTheDocument();

    fill(/Nazwa użytkownika lub Email/, 'damian');
    fill(/Hasło/, 'tajne123');
    fireEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    await waitFor(() =>
      expect(REST.loginUser).toHaveBeenCalledWith({ username: 'damian', password: 'tajne123' })
    );
    await waitFor(() => expect(router.state.location.pathname).toBe(HomeViewUrl));
  });

  it('SignUpView registers a user and shows the confirmation', async () => {
    REST.registerUser.mockResolvedValue({ message: 'Sprawdź skrzynkę' });
    renderRoutes('/sign-up');

    expect(await screen.findByRole('link', { name: 'Zaloguj się' })).toHaveAttribute(
      'href',
      '/login'
    );

    fill(/Imię/, 'Jan');
    fill(/Nazwisko/, 'Kowalski');
    fill(/Nazwa użytkownika/, 'jank');
    fill(/Email/, 'jan@example.com');
    fill(/^Hasło/, 'sekret12');
    fill(/Potwierdź hasło/, 'sekret12');
    fireEvent.click(screen.getByRole('button', { name: 'Zarejestruj się' }));

    expect(await screen.findByText('Sprawdź skrzynkę')).toBeInTheDocument();
    expect(REST.registerUser).toHaveBeenCalledWith({
      name: 'Jan',
      surname: 'Kowalski',
      username: 'jank',
      email: 'jan@example.com',
      password: 'sekret12',
    });
  });
});
