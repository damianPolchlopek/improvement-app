import { redirect } from 'react-router-dom';

import { queryClient } from '../utils/REST';

export function action() {
  localStorage.removeItem('authorization');
  localStorage.removeItem('role');
  localStorage.removeItem('expiration');

  queryClient.clear();
  
  return redirect('/login');
}