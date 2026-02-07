import { http } from './client';

export const authApi = {
  login: (payload) => http.post('/auth/login', payload),
  refresh: (payload) => http.post('/auth/refresh', payload),
  me: () => http.get('/auth/me')
};
