const { prisma } = require('../models/prismaClient');

class AttendanceRepositoryPrisma {
  async upsert(employeeId, date, data) {
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    return prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: formattedDate
        }
      },
      update: data,
      create: {
        employeeId,
        date: formattedDate,
        ...data
      }
    });
  }

  async findByEmployeeIdAndDate(employeeId, date) {
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    return prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: formattedDate
        }
      }
    });
  }

  async findByDateRange(startDate, endDate) {
    return prisma.attendance.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            jobTitle: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async findByEmployeeAndMonth(employeeId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return prisma.attendance.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
  }

  async delete(id) {
    return prisma.attendance.delete({
      where: { id }
    });
  }
}

module.exports = { AttendanceRepositoryPrisma };
