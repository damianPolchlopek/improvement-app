import { redirect } from 'react-router-dom';

import { queryClient } from '../utils/REST';
import { clearTokens } from './Authentication';

export function action() {
  clearTokens();
  queryClient.clear();
  
  return redirect('/login');
}