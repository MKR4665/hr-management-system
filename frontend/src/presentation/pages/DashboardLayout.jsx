import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../components/ui/button';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'grid' },
  { label: 'Employee management', path: '/employees', icon: 'users' },
  { label: 'Payslip management', path: '/payslips', icon: 'receipt' },
  { label: 'Recruitment pipeline', path: '/recruitment', icon: 'briefcase' },
  { label: 'Attendance & leave', path: '/attendance', icon: 'calendar' },
  { label: 'Performance reviews', path: '/performance', icon: 'spark' },
  { label: 'Benefits & compliance', path: '/benefits', icon: 'shield' },
  { label: 'Training & development', path: '/training', icon: 'graduation' },
  { label: 'Reports & analytics', path: '/reports', icon: 'chart' }
];

function MenuIcon({ name }) {
  const shared = 'h-4 w-4';
  switch (name) {
    case 'users':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 19c0-2.2-2-4-4-4s-4 1.8-4 4" />
          <circle cx="12" cy="8" r="3" />
          <path d="M20 19c0-1.6-1-3-2.5-3.6" />
          <path d="M17 4.5a3 3 0 0 1 0 7" />
        </svg>
      );
    case 'receipt':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 7h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <path d="M5 12h14" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
        </svg>
      );
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l1.8 4.8L18 9l-4.2 1.2L12 15l-1.8-4.8L6 9l4.2-1.2L12 3z" />
          <path d="M19 14l.9 2.3L22 17l-2.1.7L19 20l-.9-2.3L16 17l2.1-.7L19 14z" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
          <path d="M9.5 12l1.8 1.8 3.7-3.7" />
        </svg>
      );
    case 'graduation':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 8l9-4 9 4-9 4-9-4z" />
          <path d="M7 12v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4" />
          <path d="M21 10v5" />
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-6" />
          <path d="M22 20H2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" />
        </svg>
      );
  }
}

export default function DashboardLayout({ title, subtitle, actions, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(106,77,255,0.18),_transparent_60%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-start">
        <div
          className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity lg:hidden ${
            isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setIsSidebarOpen(false)}
          role="presentation"
        />

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-6 overflow-y-auto border-r border-brand-100 bg-white/90 px-4 py-6 shadow-xl backdrop-blur transition-transform lg:static lg:z-auto lg:translate-x-0 lg:border-0 lg:bg-transparent lg:py-0 lg:shadow-none lg:overflow-visible lg:transition-[width,padding] lg:duration-300 ${
            isSidebarCollapsed ? 'lg:w-20 lg:px-2' : 'lg:w-64 lg:px-0'
          } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-700">HRM</p>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg border border-brand-200 bg-white p-2 text-slate-600"
              aria-label="Close menu"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6l-12 12" />
              </svg>
            </button>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className={`flex items-start ${isSidebarCollapsed ? 'lg:justify-center' : 'lg:justify-between'}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-700">HRM</p>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                className="hidden rounded-lg border border-brand-200 bg-white p-2 text-slate-600 transition hover:bg-brand-50 lg:inline-flex"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  {isSidebarCollapsed ? (
                    <>
                      <rect x="4" y="5" width="14" height="14" rx="2" />
                      <path d="M8 5v14" />
                      <path d="M18 12h2.5" />
                      <path d="M16.5 9l3 3-3 3" />
                    </>
                  ) : (
                    <>
                      <rect x="6" y="5" width="14" height="14" rx="2" />
                      <path d="M10 5v14" />
                      <path d="M5.5 12H3" />
                      <path d="M7 9l-3 3 3 3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            <div className={`${isSidebarCollapsed ? 'hidden lg:block lg:text-center' : ''}`}>
              <p className="mt-3 text-lg font-semibold text-slate-900">Admin hub</p>
              <p className="text-sm text-slate-500">Manage people operations</p>
            </div>
          </div>
          <nav className="rounded-2xl border border-brand-100 bg-white/70 p-3 shadow-sm backdrop-blur">
            <p className={`px-3 pb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 ${isSidebarCollapsed ? 'lg:text-center' : ''}`}>
              Menu
            </p>
            <ul className="space-y-1 text-sm">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 transition ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-brand-50'
                      }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                    title={item.label}
                  >
                    <MenuIcon name={item.icon} />
                    <span className={`${isSidebarCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    <span
                      className={`pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-brand-100 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg ${
                        isSidebarCollapsed ? 'lg:group-hover:block' : 'lg:hidden'
                      }`}
                    >
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-600 to-brand-500 p-5 text-white shadow-sm">
            <p className={`text-sm font-semibold uppercase tracking-[0.3em] text-white/70 ${isSidebarCollapsed ? 'hidden lg:block lg:text-center' : ''}`}>
              Quick action
            </p>
            <p className={`mt-2 text-lg font-semibold ${isSidebarCollapsed ? 'hidden lg:block lg:text-center' : ''}`}>
              Run payroll
            </p>
            <p className={`text-sm text-white/80 ${isSidebarCollapsed ? 'hidden lg:block lg:text-center' : ''}`}>
              Generate payslips in minutes.
            </p>
            <Button className="mt-4 w-full bg-white text-brand-700 hover:bg-brand-50">
              {isSidebarCollapsed ? 'Go' : 'Start payroll'}
            </Button>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <div className="sticky top-4 z-30 flex min-h-16 flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-white/70 px-6 py-5 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white shadow-sm">
                AH
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-900">Admin hub</p>
                <p className="text-xs text-slate-500">People operations center</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-brand-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3l2.2 5.2L20 9l-4.3 3.5L17 19l-5-3-5 3 1.3-6.5L4 9l5.8-.8L12 3z" />
                </svg>
                Quick links
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-brand-200 bg-white p-2 text-slate-600 transition hover:bg-brand-50"
                aria-label="Notifications"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
                  <path d="M9.5 20a2.5 2.5 0 0 0 5 0" />
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-brand-200 bg-white p-2 text-slate-600 transition hover:bg-brand-50"
                aria-label="Settings"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="3.2" />
                  <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 0 1 0 4h-.1a1 1 0 0 0-.9.6z" />
                </svg>
              </button>
              <div className="flex items-center justify-center rounded-lg border border-brand-200 bg-white p-2">
                <img
                  src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%25' height='100%25' rx='32' fill='%23e6e2ff'/><circle cx='32' cy='26' r='12' fill='%236a4dff'/><rect x='14' y='40' width='36' height='18' rx='9' fill='%236a4dff'/></svg>"
                  alt="User profile"
                  className="h-4 w-4 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          <header className="flex flex-col gap-4 rounded-2xl border border-brand-100 bg-white/70 p-6 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-700">
                Workforce overview
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="inline-flex items-center justify-center rounded-lg border border-brand-200 bg-white/80 p-2 text-brand-700 shadow-sm backdrop-blur transition hover:bg-brand-50 lg:hidden"
                  aria-label="Open menu"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </svg>
                </button>
                <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                  {title}
                </h1>
              </div>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
