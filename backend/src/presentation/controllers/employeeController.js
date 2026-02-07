const employeeUsecases = require('../../domain/usecases/employees/employeeUsecases');

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await employeeUsecases.getAllEmployees();
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeUsecases.getEmployeeById(req.params.id);
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeUsecases.createEmployee(req.validated);
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeUsecases.updateEmployee(req.params.id, req.validated);
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    await employeeUsecases.deleteEmployee(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
