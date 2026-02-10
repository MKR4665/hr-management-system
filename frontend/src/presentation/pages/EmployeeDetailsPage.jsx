import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { getEmployeeById } from '../../domain/usecases/employees/employeeUsecases';
import { documentApi } from '../../data/api/documentApi';
import { useToast } from '../components/ui/toast';
import { cn } from '../../shared/lib/utils';

const availableTemplates = [
  { id: 'OFFER_LETTER', label: 'Offer Letter', sub: 'Pre-employment offer of job and terms.' },
  { id: 'APPOINTMENT_LETTER', label: 'Appointment Letter', sub: 'Official employment offer and terms.' },
  { id: 'JOINING_LETTER', label: 'Joining Letter', sub: 'Employee report for duty acknowledgment.' },
  { id: 'EMP_ID_ALLOTMENT', label: 'Employee ID Allotment', sub: 'Formal allotment of internal Employee ID.' },
  { id: 'COMPANY_POLICY_ACK', label: 'Policy Acknowledgement', sub: 'Employee acceptance of company policies.' },
  { id: 'PAYSLIP', label: 'Monthly Payslip', sub: 'Official monthly salary breakdown.' },
  { id: 'MOU', label: 'MOU', sub: 'Memorandum of understanding for collaboration.' },
  { id: 'NDA', label: 'Non-Disclosure Agreement', sub: 'Legal confidentiality terms.' },
  { id: 'INTERNSHIP_COMPLETION', label: 'Internship Completion', sub: 'Certificate for internship success.' },
  { id: 'EXPERIENCE_LETTER', label: 'Experience Letter', sub: 'Work experience and conduct certificate.' },
  { id: 'SALARY_INCREMENT', label: 'Salary Increment', sub: 'Official pay revision notice.' },
  { id: 'NOTICE_ACK', label: 'Notice Period Ack', sub: 'Resignation and notice acknowledgment.' },
  { id: 'RELIEVING_LETTER', label: 'Relieving Letter', sub: 'Official document given at time of exit.' },
  { id: 'PROMOTION_LETTER', label: 'Promotion Letter', sub: 'Confirmation of role change and promotion.' },
  { id: 'WARNING_LETTER', label: 'Warning Letter', sub: 'Formal warning for conduct or performance.' }
];

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [employee, setEmployee] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal'); 
  
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState('personal');
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionData, setRejectionData] = useState({ id: '', reason: '' });
  const [docLoading, setDocLoading] = useState(false);
  const [searchTemplate, setSearchTemplate] = useState('');

  const [formData, setFormData] = useState({});

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [emailForm, setEmailForm] = useState({
    subject: 'Important Documents - HRM HUB',
    message: 'Dear Employee,\n\nPlease find the attached documents for your records.'
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getEmployeeById(id);
      setEmployee(data);
      const docs = await documentApi.getByEmployee(id);
      setDocuments(docs);
    } catch (err) {
      toast('Failed to load employee details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [...(formData.qualifications || []), { degree: '', institution: '', year: '' }]
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

  const handleUpdateStatus = async (docId, status, reason = null) => {
    try {
      setDocLoading(true);
      await documentApi.updateStatus(docId, { status, reason });
      toast(`Document ${status.toLowerCase()} successfully.`);
      setIsRejectionModalOpen(false);
      fetchData();
    } catch (err) {
      toast('Status update failed.', 'error');
    } finally {
      setDocLoading(false);
    }
  };

  const handlePrint = (url) => {
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleOpenEdit = () => {
    setActiveEditTab('personal');
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
      password: '',
      department: employee.department,
      jobTitle: employee.jobTitle,
      status: employee.status,
      hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
      jobGrade: employee.jobGrade || '',
      employmentType: employee.employmentType || '',
      reportingManager: employee.reportingManager || '',
      workLocation: employee.workLocation || '',
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
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { updateEmployee } = await import('../../domain/usecases/employees/employeeUsecases');
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password;

      await updateEmployee(id, dataToSend);
      toast('Profile updated successfully.');
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      toast(err.message, 'error');
    }
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

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:')) return path;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  const EditTabButton = ({ id, label }) => (
    <button
      type="button"
      onClick={() => setActiveEditTab(id)}
      className={cn(
        "px-4 py-2 text-xs font-bold border-b-2 transition-all whitespace-nowrap",
        activeEditTab === id ? "border-brand-600 text-brand-600" : "border-transparent text-slate-400 hover:text-slate-600"
      )}
    >
      {label}
    </button>
  );

  // Helper to check if a document is already generated
  const getDocStatus = (type) => {
    const found = documents.find(d => d.type === type);
    return found ? found.status : 'Not Generated';
  };

  const getDocLastDate = (type) => {
    const found = documents.find(d => d.type === type);
    return found ? new Date(found.createdAt).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : null;
  };

  const missingDocs = useMemo(() => {
    const loggedTypes = documents.map(d => d.type);
    return availableTemplates.filter(t => !loggedTypes.includes(t.id));
  }, [documents]);

  const handleToggleDoc = (type) => {
    setSelectedDocs(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSyncVault = async () => {
    if (missingDocs.length === 0) return toast('Vault is already up to date.', 'info');
    try {
      setDocLoading(true);
      toast(`Generating ${missingDocs.length} missing documents...`, 'info');
      await documentApi.bulkGenerate({
        employeeId: id,
        types: missingDocs.map(t => t.id)
      });
      toast('Vault synchronized successfully.');
      fetchData();
    } catch (err) {
      toast('Sync failed.', 'error');
    } finally {
      setDocLoading(false);
    }
  };

  const handleRegenerate = async (type) => {
    try {
      setDocLoading(true);
      toast(`Regenerating ${type}...`, 'info');
      await documentApi.bulkGenerate({
        employeeId: id,
        types: [type]
      });
      toast(`${type} regenerated with latest data.`);
      fetchData();
    } catch (err) {
      toast('Regeneration failed.', 'error');
    } finally {
      setDocLoading(false);
    }
  };

  const handleSendBulk = async () => {
    if (selectedDocs.length === 0) return toast('Please select at least one document.', 'info');
    try {
      setDocLoading(true);
      await documentApi.sendEmail({
        employeeId: id,
        types: selectedDocs,
        subject: emailForm.subject,
        message: emailForm.message
      });
      toast(`Success! ${selectedDocs.length} documents sent to ${employee.email}`);
      setIsBulkModalOpen(false);
      setSelectedDocs([]);
      fetchData();
    } catch (err) {
      toast('Failed to send documents.', 'error');
    } finally {
      setDocLoading(false);
    }
  };

  const handleDocAction = async (type, action = 'preview') => {
    try {
      toast(`${action === 'preview' ? 'Generating preview...' : 'Downloading...'}`, 'info');
      const blob = await documentApi.generateAndDownload({ employeeId: id, type });
      const url = window.URL.createObjectURL(blob);
      
      if (action === 'preview') {
        window.open(url, '_blank');
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${employee.firstName}_${type}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      toast('Operation failed.', 'error');
    }
  };

  const filteredTemplates = availableTemplates.filter(t => 
    searchTemplate === '' || t.label.toLowerCase().includes(searchTemplate.toLowerCase())
  );

  if (loading) return <DashboardLayout title="Loading..."><div className="p-12 text-center text-slate-500">Fetching records...</div></DashboardLayout>;
  if (!employee) return <DashboardLayout title="Not Found"><div className="p-12 text-center text-slate-500">Employee not found.</div></DashboardLayout>;

  return (
    <DashboardLayout 
      title="Employee Profile" 
      subtitle="View and manage comprehensive employee records."
    >
      <div className="space-y-6">
        {/* TOP FULL WIDTH PROFILE CARD */}
        <Card className="border-none shadow-xl overflow-hidden bg-brand-600 text-white">
          <div className="px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="h-28 w-28 rounded-full bg-white/10 p-1.5 shadow-2xl mx-auto md:mx-0 ring-4 ring-white/20 backdrop-blur-sm">
                {employee.profilePicturePath ? (
                   <img src={getImageUrl(employee.profilePicturePath)} alt="" className="h-full w-full rounded-full object-cover shadow-inner border-2 border-white" />
                ) : (
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-brand-700 text-3xl font-black shadow-inner">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-2xl font-extrabold tracking-tight">{employee.firstName} {employee.lastName}</h1>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2",
                    employee.status === 'Active' ? "bg-emerald-500/20 border-emerald-400 text-emerald-100" : "bg-slate-500/20 border-slate-400 text-slate-100"
                  )}>
                    {employee.status}
                  </span>
                </div>
                <p className="text-brand-100 font-bold text-base uppercase tracking-wide opacity-90">{employee.jobTitle} • {employee.department}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-xs font-semibold text-brand-50">
                  <span className="flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> 
                    {employee.email}
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.042 0 00-2.83 2" /></svg> 
                    ID: {employee.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex flex-row justify-center md:justify-end gap-2 pt-4 md:pt-0">
                <Button 
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white hover:text-brand-700 bg-transparent border-2 font-bold px-4 h-10 text-xs transition-all"
                  onClick={handleOpenEdit}
                >
                  Edit Profile
                </Button>
                <Button 
                  className="border-white text-white hover:bg-white/10 bg-transparent border-2 font-bold px-4 h-10 text-xs shadow-none transition-all" 
                  onClick={() => setIsBulkModalOpen(true)}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Send Documents
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto thin-scrollbar">
          <button 
            onClick={() => setActiveTab('personal')}
            className={cn(
              "px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
              activeTab === 'personal' ? "border-brand-600 text-brand-600" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            Personal Details
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={cn(
              "px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
              activeTab === 'vault' ? "border-brand-600 text-brand-600" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            Document Vault
          </button>
          <button 
            onClick={() => setActiveTab('verification')}
            className={cn(
              "px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap",
              activeTab === 'verification' ? "border-brand-600 text-brand-600" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            Verification Center
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="min-h-[400px]">
          {activeTab === 'personal' ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-none shadow-sm">
                <CardHeader><CardTitle className="text-lg">Employment Information</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Department</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.department}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Job Title</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.jobTitle}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Job Grade</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.jobGrade || 'N/A'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Employment Type</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.employmentType || 'N/A'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Reporting Manager</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.reportingManager || 'N/A'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Work Location</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.workLocation || 'N/A'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Hire Date</Label><p className="text-sm font-semibold text-slate-900 mt-1">{new Date(employee.hireDate).toLocaleDateString()}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Date of Birth</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : 'N/A'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Primary Phone</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.phone || 'N/A'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Alt. Phone</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.alternativePhone || 'N/A'}</p></div>
                    <div className="col-span-2"><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Permanent Address</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.address || 'N/A'}</p></div>
                    
                    <div className="col-span-2">
                      <Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Qualifications</Label>
                      <div className="mt-2 space-y-2">
                        {employee.qualifications && employee.qualifications.length > 0 ? (
                          employee.qualifications.map((q, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0"></span>
                              <span className="font-bold text-slate-900">{q.degree}</span>
                              <span className="text-slate-500">from</span>
                              <span className="font-medium text-slate-700">{q.institution}</span>
                              {q.year && <span className="text-slate-400">({q.year})</span>}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400 italic">No qualifications specified.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader><CardTitle className="text-lg">Bank Account Information</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Bank Name</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.bankName || 'N/A'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Account Number</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.accountNumber || 'N/A'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">IFSC Code</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.ifscCode || 'N/A'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Branch Name</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.branchName || 'N/A'}</p></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader><CardTitle className="text-lg">Compensation Details</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Basic Salary</Label><p className="text-sm font-semibold text-slate-900 mt-1">₹ {employee.basicSalary?.toLocaleString('en-IN') || '0'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Gross Salary</Label><p className="text-sm font-semibold text-slate-900 mt-1">₹ {employee.grossSalary?.toLocaleString('en-IN') || '0'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">HRA</Label><p className="text-sm font-semibold text-slate-900 mt-1">₹ {employee.hra?.toLocaleString('en-IN') || '0'}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Notice Period</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.noticePeriod || '90'} Days</p></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm md:col-span-2">
                <CardHeader><CardTitle className="text-lg">Recent Document Activity</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {documents.slice(0, 6).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-700">{doc.type.replace(/_/g, ' ')}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase">{new Date(doc.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">{doc.status}</span>
                      </div>
                    ))}
                    {documents.length === 0 && <p className="text-sm text-slate-400 text-center py-8 w-full col-span-2">No recent activity.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : activeTab === 'verification' ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Uploaded Documents Verification</CardTitle>
                  <CardDescription>Review and validate documents uploaded by the employee.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.filter(d => d.category === 'UPLOADED').length === 0 ? (
                      <p className="text-center py-12 text-slate-400 font-medium">No uploaded documents found for verification.</p>
                    ) : (
                      documents.filter(d => d.category === 'UPLOADED').map(doc => (
                        <div key={doc.id} className="p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-brand-100 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                                doc.status === 'Approved' ? "bg-emerald-500" : doc.status === 'Rejected' ? "bg-rose-500" : "bg-amber-500"
                              )}>
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900">{doc.type.replace(/_/g, ' ')}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                                    doc.status === 'Approved' ? "bg-emerald-50 text-emerald-600" : 
                                    doc.status === 'Rejected' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                                  )}>
                                    {doc.status}
                                  </span>
                                  {doc.rejectionReason && (
                                    <span className="text-[10px] text-rose-500 font-medium italic">Reason: {doc.rejectionReason}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase gap-1" onClick={() => window.open(getImageUrl(doc.fileUrl), '_blank')}>
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c3.163 0 5.927 1.42 7.746 3.646m1.796 3.354C20.268 16.057 16.477 19 12 19c-3.163 0-5.927-1.42-7.746-3.646" /></svg>
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase gap-1" onClick={() => handlePrint(getImageUrl(doc.fileUrl))}>
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Print
                              </Button>
                              {doc.status === 'Pending' && (
                                <>
                                  <Button className="h-8 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold uppercase" onClick={() => handleUpdateStatus(doc.id, 'Approved')}>
                                    Approve
                                  </Button>
                                  <Button variant="destructive" className="h-8 text-[10px] font-bold uppercase" onClick={() => { setRejectionData({ id: doc.id, reason: '' }); setIsRejectionModalOpen(true); }}>
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Document Vault</CardTitle>
                      <CardDescription>Manage and synchronize employment records.</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white gap-2 font-bold text-brand-600"
                        onClick={handleSyncVault}
                        disabled={docLoading || missingDocs.length === 0}
                      >
                        <svg className={cn("h-4 w-4", docLoading && "animate-spin")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        {missingDocs.length > 0 ? `Generate Missing (${missingDocs.length})` : 'Synced'}
                      </Button>
                      <div className="relative w-full sm:w-64">
                        <Input 
                          placeholder="Search vault..." 
                          value={searchTemplate}
                          onChange={e => setSearchTemplate(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    {filteredTemplates.map(item => {
                      const status = getDocStatus(item.id);
                      return (
                        <div 
                          key={item.id} 
                          className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-brand-200 hover:shadow-md transition-all duration-200 gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 shrink-0 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-200">
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{item.label}</h4>
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border",
                                    status !== 'Not Generated' ? "bg-brand-50 border-brand-100 text-brand-600" : "bg-slate-50 border-slate-100 text-slate-400"
                                  )}>
                                    {status}
                                  </span>
                                  {getDocLastDate(item.id) && (
                                    <span className="text-[10px] text-slate-400 font-medium">
                                      Last sync: {getDocLastDate(item.id)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{item.sub}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0 sm:pl-4 sm:border-l border-slate-100">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 px-3 rounded-lg text-brand-600 hover:bg-brand-50 gap-2 font-bold text-[10px] uppercase"
                              onClick={() => handleDocAction(item.id, 'preview')}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c3.163 0 5.927 1.42 7.746 3.646m1.796 3.354C20.268 16.057 16.477 19 12 19c-3.163 0-5.927-1.42-7.746-3.646" /></svg>
                              Preview
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 px-3 rounded-lg text-slate-600 hover:bg-slate-100 gap-2 font-bold text-[10px] uppercase"
                              onClick={() => handleDocAction(item.id, 'download')}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              Download
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 px-3 rounded-lg text-slate-400 hover:bg-slate-100 gap-2 font-bold text-[10px] uppercase"
                              onClick={() => handleRegenerate(item.id)}
                            >
                              <svg className={cn("h-4 w-4", docLoading && "animate-spin")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                              {status === 'Not Generated' ? 'Generate' : 'Sync'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Document Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsBulkModalOpen(false)} />
          <Card className="relative w-full max-w-4xl shadow-2xl border-none h-[600px] flex flex-col overflow-hidden">
            <CardHeader className="border-b border-slate-50 shrink-0">
              <CardTitle className="text-2xl">Send Documents</CardTitle>
              <CardDescription>Select documents to bundle and email to <strong>{employee.firstName}</strong>.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex overflow-hidden min-h-0">
              <div className="flex flex-col md:flex-row w-full h-full min-h-0">
                <div className="w-full md:w-1/2 p-6 border-r border-slate-50 flex flex-col min-h-0">
                  <div className="bg-white pb-4 z-10 space-y-3 shrink-0">
                    <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Select Documents</Label>
                    <Input placeholder="Search..." value={searchTemplate} onChange={e => setSearchTemplate(e.target.value)} />
                  </div>
                  <div className="flex-1 overflow-y-auto thin-scrollbar pr-2 space-y-2">
                    {filteredTemplates.map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => handleToggleDoc(doc.id)}
                        className={cn(
                          "group flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
                          selectedDocs.includes(doc.id) ? "border-brand-500 bg-brand-50/30" : "border-slate-100 bg-white hover:border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "mt-1 h-5 w-5 rounded border-2 flex items-center justify-center shrink-0",
                          selectedDocs.includes(doc.id) ? "bg-brand-600 border-brand-600 shadow-sm" : "border-slate-300"
                        )}>
                          {selectedDocs.includes(doc.id) && <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{doc.label}</p>
                          <p className="text-[10px] text-slate-500 leading-tight">{doc.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-6 space-y-6 overflow-y-auto bg-slate-50/30 thin-scrollbar">
                  <Label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Email Message</Label>
                  <div className="space-y-4">
                    <Input value={emailForm.subject} onChange={e => setEmailForm({...emailForm, subject: e.target.value})} placeholder="Subject" />
                    <textarea 
                      className="flex min-h-[250px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      value={emailForm.message}
                      onChange={e => setEmailForm({...emailForm, message: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-6 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-slate-500">{selectedDocs.length} items selected</span>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setIsBulkModalOpen(false)}>Cancel</Button>
                <Button className="min-w-[160px] bg-brand-600 hover:bg-brand-700" disabled={docLoading || selectedDocs.length === 0} onClick={handleSendBulk}>
                  {docLoading ? 'Sending...' : 'Generate & Send'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {isRejectionModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsRejectionModalOpen(false)} />
          <Card className="relative w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle className="text-rose-600">Reject Document</CardTitle>
              <CardDescription>Please provide a reason for rejecting this document. The employee will see this message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <textarea 
                  id="rejectionReason"
                  className="w-full min-h-[120px] rounded-xl border-2 border-slate-100 p-3 text-sm focus:border-brand-500 outline-none transition-all"
                  placeholder="e.g. Document is blurry, Expired ID, etc."
                  value={rejectionData.reason}
                  onChange={(e) => setRejectionData({ ...rejectionData, reason: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsRejectionModalOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-rose-600 hover:bg-rose-700 min-w-[100px]" 
                  disabled={!rejectionData.reason.trim() || docLoading}
                  onClick={() => handleUpdateStatus(rejectionData.id, 'Rejected', rejectionData.reason)}
                >
                  {docLoading ? 'Processing...' : 'Confirm Rejection'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <Card className="relative w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <CardHeader className="border-b pb-4">
              <CardTitle>Edit Employee Profile</CardTitle>
              <div className="flex gap-2 overflow-x-auto thin-scrollbar pt-2">
                <EditTabButton id="personal" label="Personal" />
                <EditTabButton id="qualification" label="Qualification" />
                <EditTabButton id="bank" label="Bank Details" />
                <EditTabButton id="compensation" label="Compensation" />
                <EditTabButton id="credentials" label="Credentials" />
                <EditTabButton id="documents" label="Documents" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleUpdate} id="edit-employee-form" className="space-y-6">
                
                {activeEditTab === 'personal' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-4 pb-4 border-b">
                      <div className="relative">
                        {formData.profilePicture || employee.profilePicturePath ? (
                          <img src={getImageUrl(formData.profilePicture || employee.profilePicturePath)} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-brand-200" />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                        )}
                        <label htmlFor="edit-photo-upload" className="absolute -bottom-1 -right-1 h-8 w-8 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-brand-700 transition-colors">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <input id="edit-photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePicture')} />
                        </label>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Profile Picture</h4>
                        <p className="text-xs text-slate-500">Update the employee's profile photo.</p>
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
                      <Label htmlFor="email">Email Address</Label>
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

                {activeEditTab === 'qualification' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="text-sm font-bold text-slate-700">Academic Qualifications</h4>
                      <Button type="button" size="sm" variant="outline" className="h-7 text-[10px] font-bold border-brand-200 text-brand-600 hover:bg-brand-50" onClick={addQualification}>
                        + Add More
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {(formData.qualifications || []).map((q, index) => (
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

                {activeEditTab === 'bank' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h4 className="text-sm font-bold text-slate-700 border-b pb-2">Bank Account Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-bankName">Bank Name</Label>
                        <Input id="edit-bankName" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-accountNumber">Account Number</Label>
                        <Input id="edit-accountNumber" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-ifscCode">IFSC Code</Label>
                        <Input id="edit-ifscCode" value={formData.ifscCode} onChange={(e) => setFormData({...formData, ifscCode: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-branchName">Branch Name</Label>
                        <Input id="edit-branchName" value={formData.branchName} onChange={(e) => setFormData({...formData, branchName: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {activeEditTab === 'compensation' && (
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
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                      <div className="space-y-2">
                        <Label className="text-brand-600 font-black">Gross Total Salary</Label>
                        <Input id="grossSalary" className="border-brand-200 bg-brand-50/30" type="number" value={formData.grossSalary} onChange={(e) => setFormData({...formData, grossSalary: parseFloat(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="performanceBonus">Annual Bonus %</Label>
                        <Input id="performanceBonus" type="number" value={formData.performanceBonus} onChange={(e) => setFormData({...formData, performanceBonus: parseFloat(e.target.value) || 0})} />
                      </div>
                    </div>
                  </div>
                )}

                {activeEditTab === 'credentials' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h4 className="text-sm font-bold text-slate-700 border-b pb-2">Employee Portal Access</h4>
                    <div className="space-y-2">
                      <Label htmlFor="edit-password">Reset Password</Label>
                      <Input id="edit-password" type="password" placeholder="Leave blank to keep current" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                  </div>
                )}

                {activeEditTab === 'documents' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h4 className="text-sm font-bold text-slate-700 border-b pb-2">Verifications & Certificates</h4>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-xl bg-slate-50/50">
                        <Label className="block mb-2">ID Proof (Aadhar/Passport/PAN)</Label>
                        <Input type="file" className="bg-white" onChange={(e) => handleFileChange(e, 'idProof')} />
                        {employee.idProofPath && <p className="text-[10px] text-emerald-600 mt-1 font-bold">✓ File already uploaded</p>}
                      </div>
                      <div className="p-4 border rounded-xl bg-slate-50/50">
                        <Label className="block mb-2">Educational Certificates</Label>
                        <Input type="file" className="bg-white" onChange={(e) => handleFileChange(e, 'educationCert')} />
                        {employee.educationCertPath && <p className="text-[10px] text-emerald-600 mt-1 font-bold">✓ File already uploaded</p>}
                      </div>
                    </div>
                  </div>
                )}

              </form>
            </CardContent>
            <CardHeader className="border-t p-6 flex flex-row items-center justify-between">
              <div className="flex gap-3 ml-auto">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button form="edit-employee-form" type="submit" className="bg-brand-600 hover:bg-brand-700 min-w-[120px]">
                  Save Profile
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}