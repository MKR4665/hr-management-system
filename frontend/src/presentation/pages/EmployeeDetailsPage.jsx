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
  const [docLoading, setDocLoading] = useState(false);
  const [searchTemplate, setSearchTemplate] = useState('');

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
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-brand-700 text-3xl font-black shadow-inner">
                  {employee.firstName[0]}{employee.lastName[0]}
                </div>
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
                <Button variant="outline" className="border-white/40 text-white hover:bg-white hover:text-brand-700 bg-transparent border-2 font-bold px-4 h-10 text-xs transition-all">
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
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Hire Date</Label><p className="text-sm font-semibold text-slate-900 mt-1">{new Date(employee.hireDate).toLocaleDateString()}</p></div>
                    <div><Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Phone</Label><p className="text-sm font-semibold text-slate-900 mt-1">{employee.phone || 'N/A'}</p></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader><CardTitle className="text-lg">Recent Document Activity</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.slice(0, 5).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-700">{doc.type.replace(/_/g, ' ')}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase">{new Date(doc.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">{doc.status}</span>
                      </div>
                    ))}
                    {documents.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No recent activity.</p>}
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
    </DashboardLayout>
  );
}