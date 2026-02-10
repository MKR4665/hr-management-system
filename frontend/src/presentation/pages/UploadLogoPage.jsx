import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { masterApi } from '../../data/api/masterApi';
import { useToast } from '../components/ui/toast';

export default function UploadLogoPage() {
  const { toast } = useToast();
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setFetching(true);
      const config = await masterApi.getCompanyConfig();
      if (config?.logoPath) {
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
        setPreview(`${baseUrl}${config.logoPath}`);
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast('File size must be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!logo) return;
    try {
      setLoading(true);
      await masterApi.updateLogo(logo);
      toast('Company logo updated successfully.');
      setLogo(null);
      window.location.reload(); // Force reload to update sidebar logo
    } catch (err) {
      toast(err.message || 'Failed to update logo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await masterApi.deleteLogo();
      toast('Logo removed successfully.');
      setPreview(null);
      setLogo(null);
      window.location.reload(); // Force reload to update sidebar logo
    } catch (err) {
      toast('Failed to delete logo', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="Upload Company Logo" 
      subtitle="Customize the platform branding with your organization's logo."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-brand-600 pb-8">
            <CardTitle className="text-white">Branding Configuration</CardTitle>
            <CardDescription className="text-brand-100">
              This logo will appear on the sidebar and generated documents (PDFs).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 -mt-6">
            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                {fetching ? (
                  <div className="h-32 w-32 rounded-xl bg-slate-100 animate-pulse" />
                ) : preview ? (
                  <div className="relative group">
                    <img 
                      src={preview} 
                      alt="Company Logo" 
                      className="h-32 w-auto object-contain bg-white p-4 rounded-xl shadow-md border border-slate-200"
                    />
                    <label 
                      htmlFor="logo-upload" 
                      className="absolute inset-0 bg-slate-900/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold text-xs"
                    >
                      Change Image
                    </label>
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-slate-200">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">
                    {preview ? 'Update your company logo' : 'No logo uploaded yet'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Recommended: Transparent PNG, 512x512px (Max 2MB)
                  </p>
                </div>

                <input 
                  id="logo-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                
                {!preview && (
                  <Button asChild variant="outline" className="mt-4 border-brand-200 text-brand-600 font-bold hover:bg-brand-50">
                    <label htmlFor="logo-upload" className="cursor-pointer">Select File</label>
                  </Button>
                )}

                {preview && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Logo
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 flex items-center justify-between border-t pt-6">
              <p className="text-xs text-slate-400 italic">
                Changes will take effect across the entire system immediately.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  onClick={() => { setLogo(null); fetchConfig(); }}
                  disabled={!logo || loading}
                >
                  Discard
                </Button>
                <Button 
                  className="bg-brand-600 hover:bg-brand-700 min-w-[120px] shadow-lg shadow-brand-100"
                  disabled={!logo || loading}
                  onClick={handleSave}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
