import { redirect } from 'react-router-dom';

export function action() {
  localStorage.removeItem('authorization');
  localStorage.removeItem('role');
  localStorage.removeItem('expiration');
  
  return redirect('/login');
}