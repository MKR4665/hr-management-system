import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../domain/usecases/employees/employeeUsecases';
import { cn } from '../../shared/lib/utils';
import { useToast } from '../components/ui/toast';

export default function EmployeesPage() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternativePhone: '',
    address: '',
    dateOfBirth: '',
    profilePicture: '',
    experienceCert: '',
    idProof: '',
    educationCert: '',
    password: '',
    department: '',
    jobTitle: '',
    status: 'Active',
    hireDate: new Date().toISOString().split('T')[0],
    jobGrade: '',
    employmentType: 'Permanent / Full-Time',
    reportingManager: '',
    workLocation: 'Onsite',
    qualifications: [{ degree: '', institution: '', year: '' }],
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    basicSalary: 0,
    hra: 0,
    specialAllowance: 0,
    conveyanceAllowance: 0,
    grossSalary: 0,
    performanceBonus: 0,
    noticePeriod: 90
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      toast('Failed to load employees.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, { degree: '', institution: '', year: '' }]
    });
  };

  const removeQualification = (index) => {
    const updated = formData.qualifications.filter((_, i) => i !== index);
    setFormData({ ...formData, qualifications: updated.length ? updated : [{ degree: '', institution: '', year: '' }] });
  };

  const updateQualification = (index, field, value) => {
    const updated = [...formData.qualifications];
    updated[index][field] = value;
    setFormData({ ...formData, qualifications: updated });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (employee = null) => {
    setActiveTab('personal');
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone || '',
        alternativePhone: employee.alternativePhone || '',
        address: employee.address || '',
        dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : '',
        profilePicture: '',
        experienceCert: '',
        idProof: '',
        educationCert: '',
        password: '', // Password not fetched
        department: employee.department,
        jobTitle: employee.jobTitle,
        status: employee.status,
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        jobGrade: employee.jobGrade || '',
        employmentType: employee.employmentType || 'Permanent / Full-Time',
        reportingManager: employee.reportingManager || '',
        workLocation: employee.workLocation || 'Onsite',
        qualifications: employee.qualifications || [{ degree: '', institution: '', year: '' }],
        bankName: employee.bankName || '',
        accountNumber: employee.accountNumber || '',
        ifscCode: employee.ifscCode || '',
        branchName: employee.branchName || '',
        basicSalary: employee.basicSalary || 0,
        hra: employee.hra || 0,
        specialAllowance: employee.specialAllowance || 0,
        conveyanceAllowance: employee.conveyanceAllowance || 0,
        grossSalary: employee.grossSalary || 0,
        performanceBonus: employee.performanceBonus || 0,
        noticePeriod: employee.noticePeriod || 90
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        alternativePhone: '',
        address: '',
        dateOfBirth: '',
        profilePicture: '',
        experienceCert: '',
        idProof: '',
        educationCert: '',
        password: '',
        department: '',
        jobTitle: '',
        status: 'Active',
        hireDate: new Date().toISOString().split('T')[0],
        jobGrade: '',
        employmentType: 'Permanent / Full-Time',
        reportingManager: '',
        workLocation: 'Onsite',
        qualifications: [{ degree: '', institution: '', year: '' }],
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        branchName: '',
        basicSalary: 0,
        hra: 0,
        specialAllowance: 0,
        conveyanceAllowance: 0,
        grossSalary: 0,
        performanceBonus: 0,
        noticePeriod: 90
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleGrossSalaryChange = (value) => {
    const gross = parseFloat(value) || 0;
    setFormData({
      ...formData,
      grossSalary: gross,
      basicSalary: Math.round(gross * 0.4),
      hra: Math.round(gross * 0.2),
      specialAllowance: Math.round(gross * 0.3),
      conveyanceAllowance: Math.round(gross * 0.1)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      // Remove empty optional strings or passwords if not editing
      if (!dataToSend.password) delete dataToSend.password;
      
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, dataToSend);
        toast('Employee updated successfully.');
      } else {
        await createEmployee(dataToSend);
        toast('Employee created successfully.');
      }
      handleCloseModal();
      fetchEmployees();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      await updateEmployee(employeeId, { status: newStatus });
      toast(`Status updated to ${newStatus}.`);
      fetchEmployees();
    } catch (err) {
      toast('Failed to update status.', 'error');
    }
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:')) return path;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  const TabButton = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={cn(
        "px-4 py-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
        activeTab === id ? "border-brand-600 text-brand-600" : "border-transparent text-slate-400 hover:text-slate-600"
      )}
    >
      {label}
    </button>
  );

  return (
    <DashboardLayout 
      title="Employees" 
      subtitle="Manage your workforce, roles, and departments."
      actions={
        <Button onClick={() => handleOpenModal()} className="bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-100">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </Button>
      }
    >
      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input 
                  placeholder="Search by name, email, or department..." 
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Employee</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role & Dept</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">Loading employees...</td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No employees found.</td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/employees/${emp.id}`} className="flex items-center gap-3 group/link">
                          {emp.profilePicturePath ? (
                            <img src={getImageUrl(emp.profilePicturePath)} alt="" className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs group-hover/link:bg-brand-200 transition-colors">
                              {emp.firstName[0]}{emp.lastName[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover/link:text-brand-600 transition-colors">{emp.firstName} {emp.lastName}</p>
                            <p className="text-xs text-slate-500">{emp.employeeId || 'N/A'} • {emp.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">{emp.jobTitle}</p>
                        <p className="text-xs text-slate-500">{emp.department}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={emp.status}
                          onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border-none outline-none cursor-pointer transition-colors",
                            emp.status === 'Active' 
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            asChild
                            className="h-8 w-8 text-slate-400 hover:text-brand-600"
                            title="View Details"
                          >
                            <Link to={`/employees/${emp.id}`}>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c3.163 0 5.927 1.42 7.746 3.646m1.796 3.354C20.268 16.057 16.477 19 12 19c-3.163 0-5.927-1.42-7.746-3.646" />
                              </svg>
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenModal(emp)}
                            className="h-8 w-8 text-slate-400 hover:text-brand-600"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(emp.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal} />
          <Card className="relative w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <CardHeader className="border-b pb-4">
              <CardTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
              <div className="flex gap-2 overflow-x-auto thin-scrollbar pt-2">
                <TabButton id="personal" label="Personal" />
                <TabButton id="qualification" label="Qualification" />
                <TabButton id="bank" label="Bank Details" />
                <TabButton id="compensation" label="Compensation" />
                <TabButton id="credentials" label="Credentials" />
                <TabButton id="documents" label="Documents" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} id="employee-form" className="space-y-6">
                
                {activeTab === 'personal' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-4 pb-4 border-b">
                      <div className="relative">
                        {formData.profilePicture || editingEmployee?.profilePicturePath ? (
                          <img src={getImageUrl(formData.profilePicture || editingEmployee?.profilePicturePath)} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-brand-200" />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                        )}
                        <label htmlFor="photo-upload" className="absolute -bottom-1 -right-1 h-8 w-8 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-brand-700 transition-colors">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePicture')} />
                        </label>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Profile Picture</h4>
                        <p className="text-xs text-slate-500">Professional photo for identity.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Primary Mobile Number</Label>
                        <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alternativePhone">Alternative Mobile Number</Label>
                        <Input id="alternativePhone" value={formData.alternativePhone} onChange={(e) => setFormData({...formData, alternativePhone: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Permanent Address</Label>
                      <textarea 
                        id="address"
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input id="jobTitle" required value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reportingManager">Reporting Manager</Label>
                        <Input id="reportingManager" value={formData.reportingManager} onChange={(e) => setFormData({...formData, reportingManager: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workLocation">Work Location</Label>
                        <Input id="workLocation" value={formData.workLocation} onChange={(e) => setFormData({...formData, workLocation: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hireDate">Date of Joining</Label>
                        <Input id="hireDate" type="date" value={formData.hireDate} onChange={(e) => setFormData({...formData, hireDate: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="noticePeriod">Notice Period (Days)</Label>
                        <Input id="noticePeriod" type="number" value={formData.noticePeriod} onChange={(e) => setFormData({...formData, noticePeriod: parseInt(e.target.value) || 0})} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'qualification' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="text-sm font-bold text-slate-700">Academic Qualifications</h4>
                      <Button type="button" size="sm" variant="outline" className="h-7 text-[10px] font-bold border-brand-200 text-brand-600 hover:bg-brand-50" onClick={addQualification}>
                        + Add More
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.qualifications.map((q, index) => (
                        <div key={index} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-4 relative group">
                          {formData.qualifications.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => removeQualification(index)}
                              className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase text-slate-500">Degree / Certificate</Label>
                              <Input 
                                placeholder="e.g. B.Tech Computer Science" 
                                value={q.degree} 
                                onChange={(e) => updateQualification(index, 'degree', e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase text-slate-500">Institution / University</Label>
                              <Input 
                                placeholder="e.g. MIT University" 
                                value={q.institution} 
                                onChange={(e) => updateQualification(index, 'institution', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="w-1/3 space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-slate-500">Passing Year</Label>
                            <Input 
                              type="text" 
                              placeholder="e.g. 2022" 
                              value={q.year} 
                              onChange={(e) => updateQualification(index, 'year', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'bank' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h4 className="text-sm font-bold text-slate-700 border-b pb-2">Bank Account Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input id="accountNumber" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input id="ifscCode" value={formData.ifscCode} onChange={(e) => setFormData({...formData, ifscCode: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branchName">Branch Name</Label>
                        <Input id="branchName" value={formData.branchName} onChange={(e) => setFormData({...formData, branchName: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'compensation' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h4 className="text-sm font-bold text-slate-700 border-b pb-2">Salary Breakdown (Monthly)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="basicSalary">Basic Salary</Label>
                        <Input id="basicSalary" type="number" value={formData.basicSalary} onChange={(e) => setFormData({...formData, basicSalary: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hra">HRA</Label>
                        <Input id="hra" type="number" value={formData.hra} onChange={(e) => setFormData({...formData, hra: parseFloat(e.target.value) || 0})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialAllowance">Special Allowance</Label>
                        <Input id="specialAllowance" type="number" value={formData.specialAllowance} onChange={(e) => setFormData({...formData, specialAllowance: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="conveyanceAllowance">Conveyance Allowance</Label>
                        <Input id="conveyanceAllowance" type="number" value={formData.conveyanceAllowance} onChange={(e) => setFormData({...formData, conveyanceAllowance: parseFloat(e.target.value) || 0})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                      <div className="space-y-2">
                        <Label className="text-brand-600 font-black">Gross Total Salary</Label>
                        <Input id="grossSalary" className="border-brand-200 bg-brand-50/30" type="number" value={formData.grossSalary} onChange={(e) => handleGrossSalaryChange(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="performanceBonus">Annual Bonus %</Label>
                        <Input id="performanceBonus" type="number" value={formData.performanceBonus} onChange={(e) => setFormData({...formData, performanceBonus: parseFloat(e.target.value) || 0})} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'credentials' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h4 className="text-sm font-bold text-slate-700 border-b pb-2">Employee Portal Access</h4>
                    <div className="space-y-2">
                      <Label>Login Email</Label>
                      <Input value={formData.email} disabled className="bg-slate-50" />
                      <p className="text-[10px] text-slate-500">Employee will use their work email to login.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{editingEmployee ? 'Reset Password' : 'Initial Password'}</Label>
                      <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                      <p className="text-[10px] text-slate-500">Minimum 6 characters required.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h4 className="text-sm font-bold text-slate-700 border-b pb-2">Verifications & Certificates</h4>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-xl bg-slate-50/50">
                        <Label className="block mb-2">ID Proof (Aadhar/Passport/PAN)</Label>
                        <Input type="file" className="bg-white" onChange={(e) => handleFileChange(e, 'idProof')} />
                        {editingEmployee?.idProofPath && <p className="text-[10px] text-emerald-600 mt-1 font-bold">✓ File already uploaded</p>}
                      </div>

                      <div className="p-4 border rounded-xl bg-slate-50/50">
                        <Label className="block mb-2">Educational Certificates (Combined PDF/Image)</Label>
                        <Input type="file" className="bg-white" onChange={(e) => handleFileChange(e, 'educationCert')} />
                        {editingEmployee?.educationCertPath && <p className="text-[10px] text-emerald-600 mt-1 font-bold">✓ File already uploaded</p>}
                      </div>

                      <div className="p-4 border rounded-xl bg-slate-50/50">
                        <Label className="block mb-2">Previous Experience Letters</Label>
                        <Input type="file" className="bg-white" onChange={(e) => handleFileChange(e, 'experienceCert')} />
                        {editingEmployee?.experienceCertPath && <p className="text-[10px] text-emerald-600 mt-1 font-bold">✓ File already uploaded</p>}
                      </div>
                    </div>
                  </div>
                )}

              </form>
            </CardContent>
            <CardHeader className="border-t p-6 flex flex-row items-center justify-between">
              <span className="text-xs text-slate-400 font-medium italic">All data is encrypted and stored securely.</span>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button form="employee-form" type="submit" className="bg-brand-600 hover:bg-brand-700 min-w-[120px]">
                  {editingEmployee ? 'Update' : 'Create'}
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
