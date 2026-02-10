import { http } from './client';

export const masterApi = {
  getCompanyConfig: () => http.get('/master/company-config'),
  updateLogo: (logoBase64) => http.post('/master/logo', { logo: logoBase64 }),
  deleteLogo: () => http.request('/master/logo', { method: 'DELETE' }),
  
  // Geography
  getCountries: () => http.get('/master/countries'),
  createCountry: (data) => http.post('/master/countries', data),
  deleteCountry: (id) => http.request(`/master/countries/${id}`, { method: 'DELETE' }),
  
  getStates: (countryId) => http.get(`/master/countries/${countryId}/states`),
  createState: (data) => http.post('/master/states', data),
  deleteState: (id) => http.request(`/master/states/${id}`, { method: 'DELETE' }),
  
  getCities: (stateId) => http.get(`/master/states/${stateId}/cities`),
  createCity: (data) => http.post('/master/cities', data),
  deleteCity: (id) => http.request(`/master/cities/${id}`, { method: 'DELETE' })
};
