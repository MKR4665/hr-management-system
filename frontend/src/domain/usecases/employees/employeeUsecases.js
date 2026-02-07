import { employeeApi } from '../../../data/api/employeeApi';

export const getEmployees = async () => {
  return employeeApi.getAll();
};

export const getEmployeeById = async (id) => {
  return employeeApi.getById(id);
};

export const createEmployee = async (data) => {
  return employeeApi.create(data);
};

export const updateEmployee = async (id, data) => {
  return employeeApi.update(id, data);
};

export const deleteEmployee = async (id) => {
  return employeeApi.delete(id);
};
