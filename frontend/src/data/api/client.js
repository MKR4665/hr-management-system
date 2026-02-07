import { storageKeys } from '../../shared/constants/storage';

const baseUrl = import.meta.env.VITE_API_URL || '/api';

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

async function request(path, options = {}) {
  const token = localStorage.getItem(storageKeys.accessToken);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers
    });

    if (res.status === 401 && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem(storageKeys.refreshToken);
        
        if (!refreshToken) {
          isRefreshing = false;
          handleLogout();
          throw new Error('Session expired');
        }

        try {
          const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (!refreshRes.ok) throw new Error('Refresh failed');

          const data = await refreshRes.json();
          localStorage.setItem(storageKeys.accessToken, data.accessToken);
          localStorage.setItem(storageKeys.refreshToken, data.refreshToken);
          
          isRefreshing = false;
          onRefreshed(data.accessToken);
        } catch (err) {
          isRefreshing = false;
          handleLogout();
          throw err;
        }
      }

      // Return a promise that will be resolved once the token is refreshed
      const retryOriginalRequest = new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          headers['Authorization'] = `Bearer ${newToken}`;
          resolve(fetch(`${baseUrl}${path}`, { ...options, headers }));
        });
      });

      const finalRes = await retryOriginalRequest;
      return handleResponse(finalRes);
    }

    return handleResponse(res);
  } catch (error) {
    throw error;
  }
}

async function handleResponse(res) {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.error || 'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.details = data;
    throw err;
  }

  return data;
}

function handleLogout() {
  localStorage.removeItem(storageKeys.accessToken);
  localStorage.removeItem(storageKeys.refreshToken);
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export const http = {
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  get: (path) => request(path),
  request
};
