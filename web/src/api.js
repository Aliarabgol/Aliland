const BASE = '/api';

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(BASE + path, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    const err = new Error(data.error || 'خطای شبکه');
    err.status = res.status;
    err.fields = data.fields || null;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body, headers) => request(path, { method: 'POST', body, headers }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};

export function qs(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v) !== '') sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}
