const { Router } = require('express');
const authController = require('../presentation/controllers/authController');
const employeeController = require('../presentation/controllers/employeeController');
const documentController = require('../presentation/controllers/documentController');
const attendanceController = require('../presentation/controllers/attendanceController');
const masterController = require('../presentation/controllers/masterController');
const { validate } = require('../presentation/validators/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../presentation/validators/authValidators');
const { createEmployeeSchema, updateEmployeeSchema } = require('../presentation/validators/employeeValidators');
const { requireAuth } = require('../presentation/middlewares/authMiddleware');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.post('/auth/register', validate(registerSchema), authController.register);
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/refresh', validate(refreshSchema), authController.refresh);
router.get('/auth/me', requireAuth(), authController.me);

// Employee routes
router.get('/employees', requireAuth(), employeeController.getAllEmployees);
router.get('/employees/:id', requireAuth(), employeeController.getEmployeeById);
router.post('/employees', requireAuth(), validate(createEmployeeSchema), employeeController.createEmployee);
router.put('/employees/:id', requireAuth(), validate(updateEmployeeSchema), employeeController.updateEmployee);
router.delete('/employees/:id', requireAuth(), employeeController.deleteEmployee);

// Document routes
router.post('/documents/generate', requireAuth(), documentController.generateAndDownload);
router.post('/documents/bulk-generate', requireAuth(), documentController.bulkGenerate);
router.post('/documents/send-email', requireAuth(), documentController.sendBulkEmail);
router.get('/documents/employee/:employeeId', requireAuth(), documentController.getByEmployee);
router.get('/documents/monthly-status', requireAuth(), documentController.getMonthlyStatus);
router.put('/documents/:id/status', requireAuth(), documentController.updateStatus);

// Attendance routes
router.post('/attendance', requireAuth(), attendanceController.recordAttendance);
router.post('/attendance/bulk', requireAuth(), attendanceController.bulkRecord);
router.get('/attendance', requireAuth(), attendanceController.getByDateRange);
router.get('/attendance/employee/:employeeId', requireAuth(), attendanceController.getEmployeeMonthly);

// Master routes
router.get('/master/company-config', masterController.getCompanyConfig);
router.post('/master/logo', requireAuth(), masterController.updateLogo);
router.delete('/master/logo', requireAuth(), masterController.deleteLogo);
router.get('/master/countries', requireAuth(), masterController.getAllCountries);
router.post('/master/countries', requireAuth(), masterController.createCountry);
router.delete('/master/countries/:id', requireAuth(), masterController.deleteCountry);
router.get('/master/countries/:countryId/states', requireAuth(), masterController.getStatesByCountry);
router.post('/master/states', requireAuth(), masterController.createState);
router.delete('/master/states/:id', requireAuth(), masterController.deleteState);
router.get('/master/states/:stateId/cities', requireAuth(), masterController.getCitiesByState);
router.post('/master/cities', requireAuth(), masterController.createCity);
router.delete('/master/cities/:id', requireAuth(), masterController.deleteCity);

module.exports = router;
