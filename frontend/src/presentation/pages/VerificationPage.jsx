import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function VerificationPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVerification();
  }, [id]);

  const fetchVerification = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${baseUrl}/public/verify/${id}`);
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Verification failed');
      
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-xl mb-4">
            <span className="font-bold text-2xl">H</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Document Verification</h2>
          <p className="mt-2 text-sm text-slate-500">Official HR Management System Secure Check</p>
        </div>

        {loading ? (
          <Card className="border-none shadow-xl">
            <CardContent className="p-12 text-center text-slate-400">Verifying record...</CardContent>
          </Card>
        ) : error ? (
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="h-2 bg-rose-500"></div>
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Invalid Document</h3>
              <p className="text-slate-500">{error}</p>
              <Button asChild className="w-full bg-slate-900">
                <Link to="/login">Go to Login</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="h-2 bg-emerald-500"></div>
            <CardHeader className="text-center bg-slate-50/50">
              <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-emerald-600">Verification Successful</CardTitle>
              <CardDescription>This document is authentic and registered in our system.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee Name</p>
                  <p className="font-bold text-slate-900">{data.firstName} {data.lastName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification ID</p>
                  <p className="font-bold text-slate-900">{data.verificationId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</p>
                  <p className="font-bold text-slate-900">{data.department}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</p>
                  <p className="font-bold text-slate-900">{data.jobTitle}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hire Date</p>
                  <p className="font-bold text-slate-900">{new Date(data.hireDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase">
                    {data.status}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 text-center italic">
                  Information is masked for privacy protection.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        <p className="text-center text-xs text-slate-400">
          &copy; 2026 Mindmanthan Software Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}
