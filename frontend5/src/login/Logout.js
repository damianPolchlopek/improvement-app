import { redirect } from 'react-router-dom';

import { queryClient } from '../utils/REST';
import REST from '../utils/REST';
import { clearTokens } from './Authentication';

export async function action() {
  try {
    // Backend usuwa httpOnly cookies
    await REST.logoutUser();
  } catch {
    // Nawet jeśli request się nie powiedzie, czyścimy lokalny stan
  }

  clearTokens();
  queryClient.clear();

  return redirect('/login');
}
