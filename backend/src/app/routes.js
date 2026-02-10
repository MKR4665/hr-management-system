const { Router } = require('express');
const authController = require('../presentation/controllers/authController');
const employeeController = require('../presentation/controllers/employeeController');
const documentController = require('../presentation/controllers/documentController');
const attendanceController = require('../presentation/controllers/attendanceController');
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

module.exports = router;
