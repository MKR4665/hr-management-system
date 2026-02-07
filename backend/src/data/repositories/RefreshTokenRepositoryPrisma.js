const { prisma } = require('../models/prismaClient');

class RefreshTokenRepositoryPrisma {
  async create({ tokenHash, userId, expiresAt }) {
    return prisma.refreshToken.create({ data: { tokenHash, userId, expiresAt } });
  }

  async findValidByTokenHash(tokenHash) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, revoked: false, expiresAt: { gt: new Date() } }
    });
  }

  async revokeByTokenHash(tokenHash) {
    return prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true }
    });
  }
}

module.exports = { RefreshTokenRepositoryPrisma };
