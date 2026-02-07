const { Router } = require('express');
const authController = require('../presentation/controllers/authController');
const { validate } = require('../presentation/validators/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../presentation/validators/authValidators');
const { requireAuth } = require('../presentation/middlewares/authMiddleware');

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.post('/auth/register', validate(registerSchema), authController.register);
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/refresh', validate(refreshSchema), authController.refresh);
router.get('/auth/me', requireAuth(), authController.me);

module.exports = router;
