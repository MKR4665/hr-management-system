const { prisma } = require('../../data/models/prismaClient');

const generateNextEmployeeId = async () => {
  const lastEmployee = await prisma.employee.findFirst({
    where: {
      employeeId: {
        startsWith: 'EMM'
      }
    },
    orderBy: {
      employeeId: 'desc'
    }
  });

  let nextNumber = 1;
  if (lastEmployee && lastEmployee.employeeId) {
    const lastNumber = parseInt(lastEmployee.employeeId.replace('EMM', ''), 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `EMM${nextNumber.toString().padStart(4, '0')}`;
};

module.exports = { generateNextEmployeeId };
