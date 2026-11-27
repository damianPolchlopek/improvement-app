// Lokalny zapis stanu sesji (sessionStorage). Sam JWT siedzi w httpOnly cookie,
// więc front trzyma tylko czasy wygaśnięcia i role — do decyzji w UI.
// Moduł bez zależności, żeby mógł go importować zarówno REST.js, jak i Authentication.js.

const KEYS = ['isLoggedIn', 'accessTokenExpiresAt', 'refreshTokenExpiresAt', 'role'];

export function isLoggedIn() {
  return sessionStorage.getItem('isLoggedIn') === 'true';
}

function msUntil(key) {
  const expiresAt = sessionStorage.getItem(key);
  if (!expiresAt) return 0;
  return parseInt(expiresAt, 10) - Date.now();
}

export function getTokenDuration() {
  return msUntil('accessTokenExpiresAt');
}

// 0 = czas nieznany (np. sesja odtworzona z cookie w nowej karcie)
export function getRefreshTokenDuration() {
  return msUntil('refreshTokenExpiresAt');
}

export function setAccessTokenExpiresAt(accessTokenExpiresAt) {
  if (accessTokenExpiresAt != null) {
    sessionStorage.setItem('accessTokenExpiresAt', accessTokenExpiresAt.toString());
  }
}

export function setTokens(accessTokenExpiresAt, refreshTokenExpiresAt, roles) {
  sessionStorage.setItem('isLoggedIn', 'true');
  setAccessTokenExpiresAt(accessTokenExpiresAt);
  if (refreshTokenExpiresAt != null) {
    sessionStorage.setItem('refreshTokenExpiresAt', refreshTokenExpiresAt.toString());
  }
  if (roles != null) {
    sessionStorage.setItem('role', JSON.stringify(roles));
  }
}

export function clearTokens() {
  KEYS.forEach((key) => sessionStorage.removeItem(key));
}
