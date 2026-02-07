const { prisma } = require('../models/prismaClient');

class UserRepositoryPrisma {
  async create({ email, passwordHash, role }) {
    return prisma.user.create({ data: { email, passwordHash, role } });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }
}

module.exports = { UserRepositoryPrisma };
