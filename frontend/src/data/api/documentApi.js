import { http } from './client';

export const documentApi = {
  generateAndDownload: async (payload) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/documents/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('hrm_access_token')}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate document');
    return res.blob();
  },
  bulkGenerate: (payload) => http.post('/documents/bulk-generate', payload),
  sendEmail: (payload) => http.post('/documents/send-email', payload),
  getByEmployee: (employeeId) => http.get(`/documents/employee/${employeeId}`),
  getMonthlyStatus: (params) => http.get(`/documents/monthly-status?month=${params.month}&year=${params.year}`),
  updateStatus: (id, payload) => http.request(`/documents/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) })
};
