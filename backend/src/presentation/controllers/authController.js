const { register, login, refresh } = require('../../domain/usecases/auth/authUsecases');
const { UserRepositoryPrisma } = require('../../data/repositories/UserRepositoryPrisma');
const { User } = require('../../domain/entities/User');

const userRepo = new UserRepositoryPrisma();

const registerHandler = async (req, res, next) => {
  try {
    const user = await register(req.validated);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const result = await login(req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const refreshHandler = async (req, res, next) => {
  try {
    const result = await refresh(req.validated);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const meHandler = async (req, res, next) => {
  try {
    const user = await userRepo.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: new User({ id: user.id, email: user.email, role: user.role }) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register: registerHandler,
  login: loginHandler,
  refresh: refreshHandler,
  me: meHandler
};
