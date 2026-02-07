const { prisma } = require('../models/prismaClient');

class EmployeeRepositoryPrisma {
  constructor() {
    if (!prisma.employee) {
      throw new Error("Prisma client is out of sync: 'employee' model not found. Please run 'npx prisma generate'.");
    }
  }

  async create(data) {
    return prisma.employee.create({ data });
  }

  async findAll() {
    return prisma.employee.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.employee.findUnique({ where: { id } });
  }

  async update(id, data) {
    return prisma.employee.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return prisma.employee.delete({ where: { id } });
  }

  async findByEmail(email) {
    return prisma.employee.findUnique({ where: { email } });
  }
}

module.exports = { EmployeeRepositoryPrisma };