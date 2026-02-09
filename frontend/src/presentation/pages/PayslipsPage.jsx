import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { getEmployees } from '../../domain/usecases/employees/employeeUsecases';
import { documentApi } from '../../data/api/documentApi';
import { useToast } from '../components/ui/toast';
import { cn } from '../../shared/lib/utils';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function PayslipsPage() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [sentList, setSentList] = useState([]); // Track who already got payslips
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [search, setSearch] = useState('');
  
  const [period, setPeriod] = useState({
    month: months[new Date().getMonth()],
    year: currentYear
  });

  useEffect(() => {
    fetchData();
  }, [period.month, period.year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch employees first
      const empData = await getEmployees();
      setEmployees(empData);

      // Then try to fetch status (don't let it block emp list if it fails)
      try {
        const statusData = await documentApi.getMonthlyStatus({ month: period.month, year: period.year });
        setSentList(statusData); // Store full objects [{employeeId, createdAt}]
      } catch (statusErr) {
        console.error('Failed to load monthly status:', statusErr);
        setSentList([]);
      }

    } catch (err) {
      console.error('Data fetch error:', err);
      toast('Failed to load payroll data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSend = async () => {
    const sentIds = sentList.map(s => s.employeeId);
    const pendingEmps = filteredEmployees.filter(emp => !sentIds.includes(emp.id));
    if (pendingEmps.length === 0) return toast('All payslips for this period have already been sent.', 'info');
    
    if (!window.confirm(`Are you sure you want to send payslips to ${pendingEmps.length} employees?`)) return;

    try {
      setIsBulkSending(true);
      toast(`Sending ${pendingEmps.length} payslips... This might take a moment.`, 'info');
      
      // Sending in chunks or parallel
      await Promise.all(pendingEmps.map(emp => 
        documentApi.sendEmail({
          employeeId: emp.id,
          types: ['PAYSLIP'],
          month: period.month,
          year: period.year,
          subject: `Payslip for ${period.month} ${period.year} - Mindmanthan`,
          message: `Dear ${emp.firstName},\n\nPlease find your payslip for ${period.month} ${period.year} attached.`
        })
      ));

      toast(`Successfully sent ${pendingEmps.length} payslips.`);
      fetchData();
    } catch (err) {
      toast('Bulk sending failed partially.', 'error');
    } finally {
      setIsBulkSending(false);
    }
  };

  const handleDocAction = async (employee, action = 'preview') => {
    try {
      setActionLoading(employee.id);
      toast(`${action === 'preview' ? 'Generating preview...' : 'Downloading...'}`, 'info');
      
      const blob = await documentApi.generateAndDownload({ 
        employeeId: employee.id, 
        type: 'PAYSLIP',
        month: period.month,
        year: period.year
      });
      
      const url = window.URL.createObjectURL(blob);
      
      if (action === 'preview') {
        window.open(url, '_blank');
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = `Payslip_${employee.firstName}_${period.month}_${period.year}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      toast('Operation failed.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendEmail = async (employee) => {
    try {
      setActionLoading(employee.id);
      toast(`Sending payslip to ${employee.email}...`, 'info');
      
      await documentApi.sendEmail({
        employeeId: employee.id,
        types: ['PAYSLIP'],
        month: period.month,
        year: period.year,
        subject: `Payslip for ${period.month} ${period.year} - Mindmanthan`,
        message: `Dear ${employee.firstName},\n\nPlease find your payslip for ${period.month} ${period.year} attached.`
      });
      
      toast('Email sent successfully.');
      fetchData(); // Refresh to show "Sent" status and timestamp
    } catch (err) {
      toast('Failed to send email.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalPayroll = filteredEmployees.reduce((sum, emp) => sum + (emp.grossSalary || 0), 0);

  return (
    <DashboardLayout 
      title="Payroll Management" 
      subtitle="Generate and distribute monthly payslips to your workforce."
      actions={
        <Button 
          onClick={handleBulkSend} 
          disabled={isBulkSending || loading}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
        >
          {isBulkSending ? (
            <><svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...</>
          ) : (
            <><svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> Bulk Send Pending</>
          )}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* FILTERS & SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Period Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <select 
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                    value={period.month}
                    onChange={(e) => setPeriod({...period, month: e.target.value})}
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <select 
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                    value={period.year}
                    onChange={(e) => setPeriod({...period, year: parseInt(e.target.value)})}
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="relative flex-[2] min-w-[250px]">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Input 
                    placeholder="Search employees..." 
                    className="pl-10 h-10 border-slate-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-brand-600 text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-100">Total Monthly Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight text-white">₹ {totalPayroll.toLocaleString('en-IN')}</div>
              <p className="text-[10px] mt-1 font-bold text-brand-200">For {period.month} {period.year}</p>
            </CardContent>
          </Card>
        </div>

        {/* EMPLOYEE TABLE */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Employee</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Gross</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">Fetching payroll records...</td></tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">No records found for this period.</td></tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{emp.firstName} {emp.lastName}</p>
                            <p className="text-xs text-slate-500">{emp.jobTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">₹ {(emp.grossSalary || 0).toLocaleString('en-IN')}</p>
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const sentInfo = sentList.find(s => s.employeeId === emp.id);
                          return sentInfo ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">
                                Sent
                              </span>
                              <p className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                                {new Date(sentInfo.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600">
                              Pending
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-brand-600"
                            disabled={actionLoading === emp.id}
                            onClick={() => handleDocAction(emp, 'preview')}
                            title="Preview"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c3.163 0 5.927 1.42 7.746 3.646m1.796 3.354C20.268 16.057 16.477 19 12 19c-3.163 0-5.927-1.42-7.746-3.646" /></svg>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-slate-600"
                            disabled={actionLoading === emp.id}
                            onClick={() => handleDocAction(emp, 'download')}
                            title="Download"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                            disabled={actionLoading === emp.id}
                            onClick={() => handleSendEmail(emp)}
                            title="Send Email"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}