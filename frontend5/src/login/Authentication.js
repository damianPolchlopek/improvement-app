import { redirect } from 'react-router-dom';
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

export function setTokens(accessToken, refreshToken, expiresIn, refreshExpiresIn) {
  
  
  
  
  
  const expirationDate = new Date().getTime() / 1000 + expiresIn;
  const refreshExpirationDate = new Date().getTime() / 1000 + refreshExpiresIn;
  
  localStorage.setItem('authorization', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('expiration', expirationDate.toString());
  localStorage.setItem('refreshExpiration', refreshExpirationDate.toString());
}

export function clearTokens() {
  localStorage.removeItem('authorization');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('expiration');
  localStorage.removeItem('refreshExpiration');
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken || refreshToken === 'EXPIRED') {
    throw new Error('Refresh token is invalid or expired');
  }
  
  try {
    
    const data = await REST.refreshTokenRequest(refreshToken)
    console.log('Response after refresh token: ', data)

    const authorization = `Bearer ${data.accessToken}`;
    localStorage.setItem('authorization', authorization);

    const decodedToken = jwt_decode(data.accessToken);
    localStorage.setItem('expiration', decodedToken.exp.toString());


    // // Zapisz nowe tokeny
    // setTokens(
    //   data.accessToken,
    //   data.refreshToken || refreshToken, // Niektóre API zwracają nowy refresh token
    //   data.expiresIn,
    //   data.refreshExpiresIn || getRefreshTokenDuration() / 1000
    // );
    
    return data.accessToken;
  } catch (error) {
    clearTokens();
    throw error;
  }
}

export function tokenLoader() {
  const token = getAuthToken();
  return token;
}

export function checkAuthLoader() {
  console.log('checkAuthLoader');
  
  const token = getAuthToken();
  
  if (!token) {
    return redirect('/login');
  }
}