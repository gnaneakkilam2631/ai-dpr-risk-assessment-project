import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  '': 'Dashboard',
  'upload': 'Upload DPR',
  'dpr-analysis': 'DPR Analysis',
  'risk-intelligence': 'Risk Intelligence',
  'contradictions': 'Contradiction Analysis',
  'simulator': 'What-If Simulator',
  'mitigation-advisor': 'Mitigation Advisor',
  'copilot': 'DPR Copilot',
  'evidence': 'Document Evidence Viewer',
  'reports': 'Reports & Verdict',
  'settings': 'Platform Settings',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = ROUTE_LABELS[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[120px]"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
