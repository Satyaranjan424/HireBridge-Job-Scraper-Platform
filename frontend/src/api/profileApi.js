import { api } from './axios';

export function getProfile() {
  return api('/profile').then((data) => data.user);
}

export function updateProfile(payload) {
  return api('/profile', { method: 'PATCH', body: payload }).then((data) => data.user);
}

export function changePassword(payload) {
  return api('/profile/password', { method: 'PATCH', body: payload });
}
