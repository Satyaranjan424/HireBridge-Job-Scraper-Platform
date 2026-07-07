import { api, setToken } from './axios';

export async function login(credentials) {
  const data = await api('/auth/login', { method: 'POST', body: credentials });
  setToken(data.token);
  return data.user;
}

export async function register(payload) {
  const data = await api('/auth/register', { method: 'POST', body: payload });
  setToken(data.token);
  return data.user;
}

export async function loadCurrentUser() {
  return api('/auth/me').then((data) => data.user);
}

export async function logout() {
  await api('/auth/logout', { method: 'POST' }).catch(() => {});
  setToken(null);
}
