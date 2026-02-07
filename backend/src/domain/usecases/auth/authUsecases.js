const { User } = require('../../entities/User');
const { UserRepositoryPrisma } = require('../../../data/repositories/UserRepositoryPrisma');
const { RefreshTokenRepositoryPrisma } = require('../../../data/repositories/RefreshTokenRepositoryPrisma');
const { hashPassword, verifyPassword } = require('../../../shared/helpers/hash');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../../shared/helpers/jwt');
const { env } = require('../../../config/env');
const crypto = require('crypto');

const userRepo = new UserRepositoryPrisma();
const refreshRepo = new RefreshTokenRepositoryPrisma();

const register = async ({ email, password, role }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const passwordHash = await hashPassword(password);
  const created = await userRepo.create({ email, passwordHash, role });
  return new User({ id: created.id, email: created.email, role: created.role });
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + parseTtlMs(env.refreshTtl));
  await refreshRepo.create({ tokenHash, userId: user.id, expiresAt });

  return { accessToken, refreshToken, user: new User({ id: user.id, email: user.email, role: user.role }) };
};

const refresh = async ({ refreshToken }) => {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const stored = await refreshRepo.findValidByTokenHash(tokenHash);
  if (!stored) {
    const err = new Error('Invalid refresh token');
    err.status = 401;
    throw err;
  }

  await refreshRepo.revokeByTokenHash(tokenHash);

  const user = await userRepo.findById(payload.sub);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const newRefresh = signRefreshToken({ sub: user.id });

  const newHash = crypto.createHash('sha256').update(newRefresh).digest('hex');
  const expiresAt = new Date(Date.now() + parseTtlMs(env.refreshTtl));
  await refreshRepo.create({ tokenHash: newHash, userId: user.id, expiresAt });

  return { accessToken, refreshToken: newRefresh, user: new User({ id: user.id, email: user.email, role: user.role }) };
};

const parseTtlMs = (ttl) => {
  const num = Number(ttl.slice(0, -1));
  const unit = ttl.slice(-1);
  if (unit === 'm') return num * 60 * 1000;
  if (unit === 'h') return num * 60 * 60 * 1000;
  if (unit === 'd') return num * 24 * 60 * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
};

module.exports = { register, login, refresh };
