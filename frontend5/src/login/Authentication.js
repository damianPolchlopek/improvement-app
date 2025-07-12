import REST from '../utils/REST';
import jwt_decode from 'jwt-decode';

// return miliseconds
export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem('expiration');
  if (!storedExpirationDate) return 0;
  
  const expirationDate = new Date(storedExpirationDate * 1000);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();

  return duration;
}

// return miliseconds
export function getRefreshTokenDuration() {
  const storedRefreshExpiration = localStorage.getItem('refreshExpiration');
  if (!storedRefreshExpiration) return 0;
  
  const expirationDate = new Date(storedRefreshExpiration * 1000);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();

  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem('authorization');
  
  if (!token) {
    return null;
  }
  
  const tokenDuration = getTokenDuration();
  
  if (tokenDuration < 0) {
    return 'EXPIRED';
  }
  
  return token;
}

export function getRefreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return null;
  }
  
  const refreshTokenDuration = getRefreshTokenDuration();
  
  if (refreshTokenDuration < 0) {
    return 'EXPIRED';
  }
  
  return refreshToken;
}

export function setTokens(accessToken, refreshToken, type, roles) {
  const decodedToken = jwt_decode(accessToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    throw new Error('Access Token already expired');
  }

  const decodedRefreshToken = jwt_decode(refreshToken);
  if (decodedRefreshToken.exp * 1000 < Date.now()) {
    throw new Error('Refresh Token already expired');
  }

  const authorization = `${type} ${accessToken}`;

  localStorage.setItem('authorization', authorization);
  localStorage.setItem('role', JSON.stringify(roles)); // Bezpieczniejsze przechowywanie
  localStorage.setItem('expiration', decodedToken.exp.toString());
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('refreshExpiration', decodedRefreshToken.exp.toString())
}

export function clearTokens() {
  localStorage.removeItem('authorization');
  localStorage.removeItem('role');
  localStorage.removeItem('expiration');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('refreshExpiration');
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken || refreshToken === 'EXPIRED') {
    throw new Error('Refresh token is invalid or expired');
  }

  try {
    const data = await REST.refreshTokenRequest(refreshToken);

    const authorization = `Bearer ${data.accessToken}`;
    localStorage.setItem('authorization', authorization);

    const decodedToken = jwt_decode(data.accessToken);
    localStorage.setItem('expiration', decodedToken.exp.toString());


    return authorization; // Zwróć pełny token z Bearer
  } catch (error) {
    console.error('Refresh token failed:', error);
    clearTokens();
    throw error;
  }
}

export function tokenLoader() {
  const token = getAuthToken();
  return token;
}