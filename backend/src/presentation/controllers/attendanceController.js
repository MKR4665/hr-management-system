const attendanceUsecases = require('../../domain/usecases/attendance/attendanceUsecases');

const recordAttendance = async (req, res, next) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, note } = req.body;
    const result = await attendanceUsecases.recordAttendance(employeeId, date, {
      status,
      checkIn,
      checkOut,
      note
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      const err = new Error('startDate and endDate are required');
      err.status = 400;
      throw err;
    }
    const results = await attendanceUsecases.getAttendanceByDateRange(startDate, endDate);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

const getEmployeeMonthly = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;
    const results = await attendanceUsecases.getEmployeeAttendanceByMonth(
      employeeId, 
      parseInt(month), 
      parseInt(year)
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
};

const bulkRecord = async (req, res, next) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records)) {
      const err = new Error('records must be an array');
      err.status = 400;
      throw err;
    }
    const results = await attendanceUsecases.bulkRecordAttendance(records);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  recordAttendance,
  getByDateRange,
  getEmployeeMonthly,
  bulkRecord
};
