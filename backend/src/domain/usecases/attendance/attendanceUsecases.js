const { AttendanceRepositoryPrisma } = require('../../../data/repositories/AttendanceRepositoryPrisma');
const { EmployeeRepositoryPrisma } = require('../../../data/repositories/EmployeeRepositoryPrisma');

const attendanceRepo = new AttendanceRepositoryPrisma();
const employeeRepo = new EmployeeRepositoryPrisma();

const recordAttendance = async (employeeId, date, data) => {
  const employee = await employeeRepo.findById(employeeId);
  if (!employee) {
    const err = new Error('Employee not found');
    err.status = 404;
    throw err;
  }

  // Basic validation: if checkOut is provided, it must be after checkIn
  if (data.checkIn && data.checkOut) {
    if (new Date(data.checkOut) <= new Date(data.checkIn)) {
      const err = new Error('Check-out time must be after check-in time');
      err.status = 400;
      throw err;
    }
  }

  return attendanceRepo.upsert(employeeId, date, data);
};

const getAttendanceByDateRange = async (startDate, endDate) => {
  return attendanceRepo.findByDateRange(startDate, endDate);
};

const getEmployeeAttendanceByMonth = async (employeeId, month, year) => {
  return attendanceRepo.findByEmployeeAndMonth(employeeId, month, year);
};

const bulkRecordAttendance = async (records) => {
  const results = [];
  for (const record of records) {
    try {
      const result = await recordAttendance(record.employeeId, record.date, {
        status: record.status,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        note: record.note
      });
      results.push({ employeeId: record.employeeId, success: true, id: result.id });
    } catch (error) {
      results.push({ employeeId: record.employeeId, success: false, error: error.message });
    }
  }
  return results;
};

module.exports = {
  recordAttendance,
  getAttendanceByDateRange,
  getEmployeeAttendanceByMonth,
  bulkRecordAttendance
};
