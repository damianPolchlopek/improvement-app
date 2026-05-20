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

export function tokenLoader() {
  return getAuthToken();
}
