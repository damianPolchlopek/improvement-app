import REST from '../utils/REST';

export function getTokenDuration() {
  const expiresAt = sessionStorage.getItem('accessTokenExpiresAt');
  if (!expiresAt) return 0;
  return parseInt(expiresAt) - Date.now();
}

export function getRefreshTokenDuration() {
  const expiresAt = sessionStorage.getItem('refreshTokenExpiresAt');
  if (!expiresAt) return 0;
  return parseInt(expiresAt) - Date.now();
}

export function getAuthToken() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  if (!isLoggedIn) return null;

  const tokenDuration = getTokenDuration();
  if (tokenDuration < 0) return 'EXPIRED';

  return 'cookie';
}

export function getRefreshToken() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  if (!isLoggedIn) return null;

  const refreshDuration = getRefreshTokenDuration();
  if (refreshDuration < 0) return 'EXPIRED';

  return 'cookie';
}

export function setTokens(accessTokenExpiresAt, refreshTokenExpiresAt, roles) {
  sessionStorage.setItem('isLoggedIn', 'true');
  sessionStorage.setItem('accessTokenExpiresAt', accessTokenExpiresAt.toString());
  sessionStorage.setItem('refreshTokenExpiresAt', refreshTokenExpiresAt.toString());
  sessionStorage.setItem('role', JSON.stringify(roles));
}

export function clearTokens() {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('accessTokenExpiresAt');
  sessionStorage.removeItem('refreshTokenExpiresAt');
  sessionStorage.removeItem('role');
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken || refreshToken === 'EXPIRED') {
    throw new Error('Refresh token is invalid or expired');
  }

  try {
    // Backend czyta refresh_token z httpOnly cookie automatycznie
    const data = await REST.refreshTokenRequest();
    sessionStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt.toString());
    return 'cookie';
  } catch (error) {
    clearTokens();
    throw error;
  }
}

export async function tokenLoader() {
  const token = getAuthToken();
  // sessionStorage zna sesję ('cookie' albo 'EXPIRED') → zwróć od razu
  if (token) return token;

  // Brak lokalnego stanu sesji (np. świeża karta), ale httpOnly cookie może być
  // wciąż ważne. Spróbuj cicho odtworzyć sesję z cookie przez refresh — dzięki temu
  // otwarcie nowej karty nie wymusza ponownego logowania, gdy cookie wciąż żyje.
  try {
    const data = await REST.refreshTokenRequest();
    sessionStorage.setItem('isLoggedIn', 'true');
    if (data?.accessTokenExpiresAt != null) {
      sessionStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt.toString());
    }
    if (data?.refreshTokenExpiresAt != null) {
      sessionStorage.setItem('refreshTokenExpiresAt', data.refreshTokenExpiresAt.toString());
    }
    if (data?.roles != null) {
      sessionStorage.setItem('role', JSON.stringify(data.roles));
    }
    return 'cookie';
  } catch {
    return null; // brak ważnej sesji → Layout przekieruje na /login
  }
}
