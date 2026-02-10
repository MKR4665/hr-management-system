import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { attendanceApi } from '../../data/api/attendanceApi';
import { employeeApi } from '../../data/api/employeeApi';
import { useToast } from '../components/ui/toast';
import { cn } from '../../shared/lib/utils';

export default function AttendancePage() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  
  // Monthly History State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [historyMonth, setHistoryMonth] = useState(new Date().getMonth() + 1);
  const [historyYear, setHistoryYear] = useState(new Date().getFullYear());
  const [historyLoading, setHistoryLoading] = useState(false);

  // Local state for modified records before saving
  const [modifiedRecords, setModifiedRecords] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, [selectedDate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [empData, attData] = await Promise.all([
        employeeApi.getAll(),
        attendanceApi.getByDateRange(selectedDate, selectedDate)
      ]);
      setEmployees(empData);
      setAttendanceRecords(attData);
      
      // Reset modified records
      setModifiedRecords({});
    } catch (err) {
      toast('Failed to load attendance data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyHistory = async (employeeId, month, year) => {
    try {
      setHistoryLoading(true);
      const data = await attendanceApi.getEmployeeMonthly(employeeId, month, year);
      setMonthlyRecords(data);
    } catch (err) {
      toast('Failed to load history.', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenHistory = (employee) => {
    setSelectedEmployee(employee);
    setHistoryMonth(new Date().getMonth() + 1);
    setHistoryYear(new Date().getFullYear());
    setIsHistoryModalOpen(true);
    fetchMonthlyHistory(employee.id, new Date().getMonth() + 1, new Date().getFullYear());
  };

  const handleHistoryParamsChange = (month, year) => {
    setHistoryMonth(month);
    setHistoryYear(year);
    if (selectedEmployee) {
      fetchMonthlyHistory(selectedEmployee.id, month, year);
    }
  };

  const getRecordForEmployee = (employeeId) => {
    return attendanceRecords.find(r => r.employeeId === employeeId) || {
      employeeId,
      status: 'Present',
      checkIn: '',
      checkOut: '',
      note: ''
    };
  };

  const handleStatusChange = (employeeId, status) => {
    const current = modifiedRecords[employeeId] || getRecordForEmployee(employeeId);
    setModifiedRecords({
      ...modifiedRecords,
      [employeeId]: { ...current, status }
    });
  };

  const handleTimeChange = (employeeId, field, value) => {
    const current = modifiedRecords[employeeId] || getRecordForEmployee(employeeId);
    
    // Combine date and time
    let dateTime = null;
    if (value) {
      dateTime = `${selectedDate}T${value}:00`;
    }

    setModifiedRecords({
      ...modifiedRecords,
      [employeeId]: { ...current, [field]: dateTime }
    });
  };

  const handleNoteChange = (employeeId, note) => {
    const current = modifiedRecords[employeeId] || getRecordForEmployee(employeeId);
    setModifiedRecords({
      ...modifiedRecords,
      [employeeId]: { ...current, note }
    });
  };

  const handleSaveAll = async () => {
    const recordsToSave = Object.values(modifiedRecords).map(record => ({
      ...record,
      date: selectedDate
    }));

    if (recordsToSave.length === 0) {
      toast('No changes to save.');
      return;
    }

    try {
      setSaving(true);
      await attendanceApi.bulkRecord(recordsToSave);
      toast('Attendance records updated successfully.');
      fetchInitialData();
    } catch (err) {
      toast(err.message || 'Failed to save attendance.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'text-green-600 bg-green-50 border-green-200';
      case 'Absent': return 'text-red-600 bg-red-50 border-red-200';
      case 'Half Day': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Leave': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Late': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <DashboardLayout title="Attendance Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Daily Attendance</h2>
            <p className="text-muted-foreground">Manage and track employee attendance for your organization.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="date-picker" className="text-xs uppercase font-bold text-muted-foreground">Select Date</Label>
              <Input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
            </div>
            <Button 
              onClick={handleSaveAll} 
              disabled={saving || Object.keys(modifiedRecords).length === 0}
              className="mt-5"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Card shadow="sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Employee Attendance List</CardTitle>
                <CardDescription>
                  Showing records for {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </CardDescription>
              </div>
              <div className="flex gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Present</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Absent</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Leave</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Check-In</th>
                      <th className="px-6 py-4">Check-Out</th>
                      <th className="px-6 py-4">Notes</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {employees.map((employee) => {
                      const record = modifiedRecords[employee.id] || getRecordForEmployee(employee.id);
                      const checkInTime = record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
                      const checkOutTime = record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';

                      return (
                        <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900">{employee.firstName} {employee.lastName}</span>
                              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">{employee.jobTitle} • {employee.department}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={record.status}
                              onChange={(e) => handleStatusChange(employee.id, e.target.value)}
                              className={cn(
                                "px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer",
                                getStatusColor(record.status)
                              )}
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Half Day">Half Day</option>
                              <option value="Leave">Leave</option>
                              <option value="Late">Late</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <Input
                              type="time"
                              value={checkInTime}
                              onChange={(e) => handleTimeChange(employee.id, 'checkIn', e.target.value)}
                              disabled={record.status === 'Absent' || record.status === 'Leave'}
                              className="h-9 text-xs w-28 bg-slate-50/50 border-slate-200"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <Input
                              type="time"
                              value={checkOutTime}
                              onChange={(e) => handleTimeChange(employee.id, 'checkOut', e.target.value)}
                              disabled={record.status === 'Absent' || record.status === 'Leave'}
                              className="h-9 text-xs w-28 bg-slate-50/50 border-slate-200"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <Input
                              placeholder="Remarks..."
                              value={record.note || ''}
                              onChange={(e) => handleNoteChange(employee.id, e.target.value)}
                              className="h-9 text-xs min-w-[140px] bg-slate-50/50 border-slate-200"
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenHistory(employee)}
                              className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 font-bold text-[11px] uppercase tracking-wider"
                            >
                              View History
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {employees.length === 0 && (
                  <div className="text-center py-20">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium">No employees found in the system.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-none">
            <CardHeader className="border-b border-slate-100 bg-white sticky top-0 z-10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-lg shadow-inner">
                    {selectedEmployee?.firstName[0]}{selectedEmployee?.lastName[0]}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedEmployee?.firstName} {selectedEmployee?.lastName}</CardTitle>
                    <CardDescription className="font-medium text-slate-500">{selectedEmployee?.jobTitle} • {selectedEmployee?.department}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={historyMonth}
                    onChange={(e) => handleHistoryParamsChange(parseInt(e.target.value), historyYear)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={historyYear}
                    onChange={(e) => handleHistoryParamsChange(historyMonth, parseInt(e.target.value))}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {[2024, 2025, 2026].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsHistoryModalOpen(false)}
                    className="h-9 w-9 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto p-0 flex-1 thin-scrollbar bg-slate-50/30">
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
                  <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading Records...</span>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Days</div>
                      <div className="text-2xl font-bold text-slate-900">{monthlyRecords.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1">Present</div>
                      <div className="text-2xl font-bold text-green-600">{monthlyRecords.filter(r => r.status === 'Present').length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">Absent</div>
                      <div className="text-2xl font-bold text-red-600">{monthlyRecords.filter(r => r.status === 'Absent').length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Leave</div>
                      <div className="text-2xl font-bold text-blue-600">{monthlyRecords.filter(r => r.status === 'Leave').length}</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Check-In</th>
                          <th className="px-6 py-4">Check-Out</th>
                          <th className="px-6 py-4">Duration</th>
                          <th className="px-6 py-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {monthlyRecords.map((record) => {
                          const date = new Date(record.date);
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          
                          let duration = '-';
                          if (record.checkIn && record.checkOut) {
                            const diff = new Date(record.checkOut) - new Date(record.checkIn);
                            const hours = Math.floor(diff / 3600000);
                            const minutes = Math.floor((diff % 3600000) / 60000);
                            duration = `${hours}h ${minutes}m`;
                          }

                          return (
                            <tr key={record.id} className={cn("hover:bg-slate-50/50 transition-colors", isWeekend && "bg-slate-50/30")}>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-700">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{date.toLocaleDateString('en-IN', { weekday: 'long' })}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                  getStatusColor(record.status)
                                )}>
                                  {record.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-600">
                                {record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-600">
                                {record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-500">
                                {duration}
                              </td>
                              <td className="px-6 py-4 text-slate-500 italic text-xs">
                                {record.note || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {monthlyRecords.length === 0 && (
                      <div className="text-center py-20 text-slate-400 font-medium bg-slate-50/30 uppercase text-xs tracking-widest italic">
                        No records found for this month
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}