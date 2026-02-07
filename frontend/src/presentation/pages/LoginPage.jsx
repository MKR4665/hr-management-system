import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { login } from '../../domain/usecases/auth/login';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Login failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(106,77,255,0.15),_transparent_55%)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-700">HRM</p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to manage your workforce</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={onChange}
                  required
                  minLength={8}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Continue'}
              </Button>
              {status.type !== 'idle' && (
                <p
                  className={`text-sm ${
                    status.type === 'error' ? 'text-red-600' : 'text-green-600'
                  }`}
                  role="status"
                >
                  {status.message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-3 text-center text-xs text-slate-500">
          <p>By signing in you agree to our policies.</p>
          <p className="text-brand-700">Need access? Contact your HR admin.</p>
        </div>
      </div>
    </div>
  );
}
