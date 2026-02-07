const { EmployeeRepositoryPrisma } = require('../../../data/repositories/EmployeeRepositoryPrisma');

const employeeRepo = new EmployeeRepositoryPrisma();

const getAllEmployees = async () => {
  return employeeRepo.findAll();
};

const getEmployeeById = async (id) => {
  const employee = await employeeRepo.findById(id);
  if (!employee) {
    const err = new Error('Employee not found');
    err.status = 404;
    throw err;
  }
  return employee;
};

const createEmployee = async (data) => {
  const existing = await employeeRepo.findByEmail(data.email);
  if (existing) {
    const err = new Error('Employee with this email already exists');
    err.status = 409;
    throw err;
  }
  return employeeRepo.create(data);
};

const updateEmployee = async (id, data) => {
  await getEmployeeById(id);
  return employeeRepo.update(id, data);
};

const deleteEmployee = async (id) => {
  await getEmployeeById(id);
  return employeeRepo.delete(id);
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
