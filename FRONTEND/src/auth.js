import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function getUserRole() {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
}
