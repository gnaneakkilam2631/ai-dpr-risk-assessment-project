import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  UploadCloud,
  FileCheck2,
  AlertOctagon,
  Scale,
  SlidersHorizontal,
  Lightbulb,
  BotMessageSquare,
  FileText,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Building2,
  Eye,
  FileSearch,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ToastContainer } from '../common/ToastContainer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    projects,
    activeProject,
    setActiveProjectById,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    contradictions,
  } = useProject();

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unresolvedContradictionsCount = contradictions.filter((c) => !c.reviewed).length;

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Upload DPR', path: '/upload', icon: UploadCloud },
    { label: 'DPR Analysis', path: '/dpr-analysis', icon: FileCheck2 },
    { label: 'Risk Intelligence', path: '/risk-intelligence', icon: AlertOctagon },
    {
      label: 'Contradictions',
      path: '/contradictions',
      icon: Scale,
      badge: unresolvedContradictionsCount > 0 ? `${unresolvedContradictionsCount}` : undefined,
    },
    { label: 'What-if Simulator', path: '/simulator', icon: SlidersHorizontal },
    { label: 'Mitigation Advisor', path: '/mitigation-advisor', icon: Lightbulb },
    { label: 'DPR Copilot', path: '/copilot', icon: BotMessageSquare, isAi: true },
    { label: 'Evidence Viewer', path: '/evidence', icon: FileSearch },
    { label: 'Reports & Verdict', path: '/reports', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (searchQuery.toLowerCase().includes('risk')) {
      navigate('/risk-intelligence');
    } else if (searchQuery.toLowerCase().includes('cost') || searchQuery.toLowerCase().includes('budget') || searchQuery.toLowerCase().includes('contradict')) {
      navigate('/contradictions');
    } else if (searchQuery.toLowerCase().includes('evidence') || searchQuery.toLowerCase().includes('boq')) {
      navigate('/evidence');
    } else {
      navigate(`/copilot?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#080d1a] dark:text-slate-100 font-sans">
      {/* Toast notifications portal */}
      <ToastContainer />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/90 bg-[#0B1220] text-slate-200 transition-transform duration-300 ease-in-out dark:border-slate-800/80 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* LOGO & BRAND */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-white tracking-tight text-base">
              AI-DPR <span className="text-cyan-400">Guardian</span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ACTIVE PROJECT QUICK PILL */}
        <div className="mx-3 my-3 rounded-lg bg-slate-800/60 border border-slate-800 p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-400" />
              Active Project
            </span>
            <span className="font-mono text-cyan-400 text-[10px] bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
              {activeProject.state}
            </span>
          </div>
          <p className="text-xs font-semibold text-white truncate mt-1" title={activeProject.name}>
            {activeProject.name}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
            <span>₹{activeProject.totalCostCr} Cr</span>
            <span className="font-mono text-slate-300">Health: {activeProject.healthScore}/100</span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 py-2 px-3 space-y-1 text-sm overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/mitigation' && location.pathname === '/mitigation-advisor');
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 rounded-md transition-colors'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-white' : item.isAi ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.isAi && (
                    <span className="rounded bg-cyan-900/60 border border-cyan-700/50 px-1.5 py-0.2 text-[9px] font-bold text-cyan-300 uppercase tracking-wider">
                      AI
                    </span>
                  )}
                  {item.badge && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE & CONTROLS AT BOTTOM */}
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                DR
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">DPR Reviewer</p>
                <p className="text-[10px] text-slate-400 truncate">Gov. Agency Admin</p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            >
              {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-1 flex-col lg:pl-72 min-w-0">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 dark:bg-[#0B1220] dark:border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <Breadcrumbs />
            </div>
          </div>

          {/* RIGHT CONTROLS: SEARCH, PROJECT SWITCHER, NOTIFICATIONS */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* SEARCH INPUT */}
            <form onSubmit={handleSearch} className="relative hidden md:block w-48 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, findings..."
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 border-none rounded-full w-full focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200"
              />
            </form>

            <button
              onClick={() => navigate('/upload')}
              className="hidden sm:inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition shadow-xs cursor-pointer"
            >
              + Analyze New DPR
            </button>

            {/* PROJECT SELECTOR DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer max-w-[170px] sm:max-w-[200px]"
              >
                <Building2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">{activeProject.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              </button>

              {projectDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-[#0c1427] z-50"
                  onClick={() => setProjectDropdownOpen(false)}
                >
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Infrastructure DPR
                  </div>
                  <div className="mt-1 space-y-1 max-h-72 overflow-y-auto">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveProjectById(p.id)}
                        className={`w-full text-left rounded-lg p-2 text-xs transition cursor-pointer ${
                          p.id === activeProject.id
                            ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{p.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{p.state}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                          <span>₹{p.totalCostCr} Cr</span>
                          <span className={p.overallRisk === 'critical' || p.overallRisk === 'high' ? 'text-rose-500 font-bold' : 'text-emerald-500'}>
                            {p.overallRisk.toUpperCase()} RISK
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                    <Link
                      to="/upload"
                      className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 py-1"
                    >
                      + Ingest New DPR File
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* NOTIFICATIONS BELL */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[8px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-[#0c1427] z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Audit Notifications ({unreadCount} new)
                    </span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.link) {
                            navigate(n.link);
                            setNotifDropdownOpen(false);
                          }
                        }}
                        className={`rounded-lg p-2.5 text-xs transition cursor-pointer ${
                          !n.read
                            ? 'bg-blue-50/70 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/40'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY OUTLET */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
