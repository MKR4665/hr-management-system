import { http } from './client';

export const employeeApi = {
  getAll: () => http.get('/employees'),
  getById: (id) => http.get(`/employees/${id}`),
  create: (data) => http.post('/employees', data),
  update: (id, data) => http.request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => http.request(`/employees/${id}`, { method: 'DELETE' })
};
