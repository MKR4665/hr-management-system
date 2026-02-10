import { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { cn } from '../../shared/lib/utils';
import { masterApi } from '../../data/api/masterApi';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'grid' },
  { label: 'Employees', path: '/employees', icon: 'users' },
  { label: 'Payslips', path: '/payslips', icon: 'receipt' },
  { label: 'Recruitment', path: '/recruitment', icon: 'briefcase' },
  { label: 'Attendance', path: '/attendance', icon: 'calendar' },
  { label: 'Performance', path: '/performance', icon: 'spark' },
  { label: 'Benefits', path: '/benefits', icon: 'shield' },
  { label: 'Training', path: '/training', icon: 'graduation' },
  { label: 'Reports', path: '/reports', icon: 'chart' }
];

const shortcutItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Employees', path: '/employees' },
  { label: 'Recruitment', path: '/recruitment' }
];

function MenuIcon({ name, className }) {
  const shared = cn('h-5 w-5', className);
  switch (name) {
    case 'users':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 19c0-2.2-2-4-4-4s-4 1.8-4 4" />
          <circle cx="12" cy="8" r="3" />
          <path d="M20 19c0-1.6-1-3-2.5-3.6" />
          <path d="M17 4.5a3 3 0 0 1 0 7" />
        </svg>
      );
    case 'receipt':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 7h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          <path d="M5 12h14" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
        </svg>
      );
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l1.8 4.8L18 9l-4.2 1.2L12 15l-1.8-4.8L6 9l4.2-1.2L12 3z" />
          <path d="M19 14l.9 2.3L22 17l-2.1.7L19 20l-.9-2.3L16 17l2.1-.7L19 14z" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
          <path d="M9.5 12l1.8 1.8 3.7-3.7" />
        </svg>
      );
    case 'graduation':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8l9-4 9 4-9 4-9-4z" />
          <path d="M7 12v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4" />
          <path d="M21 10v5" />
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-6" />
          <path d="M22 20H2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={shared} fill="none" stroke="currentColor" strokeWidth="2">
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
  const [isMasterListOpen, setIsMasterListOpen] = useState(false);
  const [logoPath, setLogoPath] = useState(null);
  const location = useLocation();

  const isMasterPathActive = ['/master/logo', '/master/countries', '/master/states', '/master/cities'].includes(location.pathname);

  useEffect(() => {
    setIsSidebarOpen(false);
    if (isMasterPathActive) setIsMasterListOpen(true);
    fetchLogo();
  }, [location.pathname]);

  const fetchLogo = async () => {
    try {
      const config = await masterApi.getCompanyConfig();
      if (config?.logoPath) setLogoPath(config.logoPath);
    } catch (err) {
      console.error('Failed to fetch logo:', err);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden',
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out lg:static lg:z-auto',
          isSidebarCollapsed ? 'w-20' : 'w-72',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <div className={cn('flex items-center gap-3 overflow-hidden transition-all', isSidebarCollapsed && 'lg:justify-center lg:px-0')}>
            {logoPath ? (
              <img src={getImageUrl(logoPath)} alt="Logo" className="h-9 w-auto object-contain" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-lg shadow-brand-200">
                <span className="font-bold text-lg">H</span>
              </div>
            )}
            {!isSidebarCollapsed && (
              <span className="font-bold text-xl tracking-tight text-slate-900">HRM Hub</span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 thin-scrollbar">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm shadow-brand-100/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                <MenuIcon
                  name={item.icon}
                  className={cn(
                    'shrink-0 transition-colors',
                    location.pathname === item.path ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                {!isSidebarCollapsed && <span>{item.label}</span>}
                {isSidebarCollapsed && (
                  <div className="absolute left-16 z-50 hidden group-hover:block px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}

            {/* Master List Module */}
            <div className="pt-4">
              <button
                onClick={() => setIsMasterListOpen(!isMasterListOpen)}
                className={cn(
                  "w-full group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isMasterPathActive ? "bg-slate-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <MenuIcon name="master" className={isMasterPathActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"} />
                  {!isSidebarCollapsed && <span>Master List</span>}
                </div>
                {!isSidebarCollapsed && (
                  <svg className={cn("h-4 w-4 transition-transform duration-200", isMasterListOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {isMasterListOpen && !isSidebarCollapsed && (
                <div className="mt-1 ml-4 pl-4 border-l border-slate-100 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  <NavLink to="/master/logo" className={({ isActive }) => cn("block py-2 text-xs font-bold transition-colors", isActive ? "text-brand-600" : "text-slate-500 hover:text-slate-900")}>
                    Upload Logo
                  </NavLink>
                  <NavLink to="/master/countries" className={({ isActive }) => cn("block py-2 text-xs font-bold transition-colors", isActive ? "text-brand-600" : "text-slate-500 hover:text-slate-900")}>
                    Add Country
                  </NavLink>
                  <NavLink to="/master/states" className={({ isActive }) => cn("block py-2 text-xs font-bold transition-colors", isActive ? "text-brand-600" : "text-slate-500 hover:text-slate-900")}>
                    Add States
                  </NavLink>
                  <NavLink to="/master/cities" className={({ isActive }) => cn("block py-2 text-xs font-bold transition-colors", isActive ? "text-brand-600" : "text-slate-500 hover:text-slate-900")}>
                    Add City
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            <svg
              className={cn('h-5 w-5 transition-transform duration-300', isSidebarCollapsed && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!isSidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Shortcut Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {shortcutItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    "px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors",
                    location.pathname === item.path 
                      ? "text-brand-700 bg-brand-50" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 transition-colors">
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shadow-inner">
                JD
              </div>
              <span className="hidden md:block text-sm font-semibold text-slate-700">John Doe</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 thin-scrollbar">
          <div className="space-y-4">
            {/* Breadcrumb moved here */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Link to="/dashboard" className="hover:text-brand-600 transition-colors">Home</Link>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-600">{location.pathname.replace('/', '') || 'Dashboard'}</span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                {subtitle && <p className="text-slate-500 text-sm sm:text-base">{subtitle}</p>}
              </div>
              {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
