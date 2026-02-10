import { http } from './client';

export const attendanceApi = {
  record: (data) => http.post('/attendance', data),
  bulkRecord: (records) => http.post('/attendance/bulk', { records }),
  getByDateRange: (startDate, endDate) => http.get(`/attendance?startDate=${startDate}&endDate=${endDate}`),
  getEmployeeMonthly: (employeeId, month, year) => 
    http.get(`/attendance/employee/${employeeId}?month=${month}&year=${year}`)
};
