const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export function getToken() {
  return localStorage.getItem('hirebridge_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('hirebridge_token', token);
  } else {
    localStorage.removeItem('hirebridge_token');
  }
}

function cleanValue(value) {
  if (Array.isArray(value)) return value.map(cleanValue).filter((item) => item !== undefined);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, cleanValue(item)])
        .filter(([, item]) => item !== undefined),
    );
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }
  return value;
}

export function sanitizePayload(payload) {
  return cleanValue(payload);
}

export async function api(path, options = {}) {
  const headers = new Headers(options.headers);
  const body = options.body && typeof options.body !== 'string'
    ? JSON.stringify(sanitizePayload(options.body))
    : options.body;

  if (body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (getToken()) headers.set('Authorization', `Bearer ${getToken()}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
    body,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validation = payload.errors
      ? Object.entries(payload.errors).flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`)).join(' ')
      : '';
    throw new Error(validation || payload.message || 'Request failed');
  }

  return payload.data ?? payload;
}
