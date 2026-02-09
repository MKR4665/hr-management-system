const { prisma } = require('../models/prismaClient');

class DocumentRepositoryPrisma {
  async create(data) {
    return prisma.document.create({ 
      data: {
        ...data,
        category: data.category || 'GENERATED'
      } 
    });
  }

  async findByEmployeeId(employeeId) {
    return prisma.document.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.document.findUnique({
      where: { id },
      include: { employee: true }
    });
  }

  async updateStatus(id, status, rejectionReason = null) {
    return prisma.document.update({
      where: { id },
      data: { 
        status,
        rejectionReason: status === 'Rejected' ? rejectionReason : null
      }
    });
  }
}

module.exports = { DocumentRepositoryPrisma };
