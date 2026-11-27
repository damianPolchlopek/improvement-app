import REST from '../utils/REST';
import { isLoggedIn, getRefreshTokenDuration, setTokens, clearTokens } from './session';

export { getTokenDuration, getRefreshTokenDuration, setTokens, clearTokens } from './session';

// Odświeżanie access tokenu robi wyłącznie interceptor 401 w REST.js
// (refresh + ponowienie requestu). Tu tylko ustalamy, czy sesja w ogóle istnieje.
export async function tokenLoader() {
  // Znany stan sesji, a refresh token (jeśli znamy jego czas) jeszcze żyje.
  // Wygasły access token nie przeszkadza — pierwszy request go odświeży.
  if (isLoggedIn() && getRefreshTokenDuration() >= 0) return 'cookie';

  // Brak lokalnego stanu sesji (np. świeża karta), ale httpOnly cookie może być
  // wciąż ważne. Spróbuj cicho odtworzyć sesję z cookie przez refresh — dzięki temu
  // otwarcie nowej karty nie wymusza ponownego logowania, gdy cookie wciąż żyje.
  try {
    const data = await REST.refreshTokenRequest();
    setTokens(data?.accessTokenExpiresAt, data?.refreshTokenExpiresAt, data?.roles);
    return 'cookie';
  } catch {
    clearTokens(); // nieaktualny lokalny stan (np. wygasły refresh token) → wyczyść
    return null; // brak ważnej sesji → Layout przekieruje na /login
  }
}
