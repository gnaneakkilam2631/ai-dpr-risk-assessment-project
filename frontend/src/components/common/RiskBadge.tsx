import React from 'react';
import { RiskSeverity } from '../../types';

interface RiskBadgeProps {
  severity: RiskSeverity | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  severity,
  size = 'md',
  showPulse = false,
  className = '',
}) => {
  const norm = severity.toLowerCase();

  let bgClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let dotClass = 'bg-slate-400';
  let label = severity.toUpperCase();

  if (norm === 'low') {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50';
    dotClass = 'bg-emerald-500';
    label = 'LOW RISK';
  } else if (norm === 'medium') {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50';
    dotClass = 'bg-amber-500';
    label = 'MEDIUM RISK';
  } else if (norm === 'high') {
    bgClass = 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/50';
    dotClass = 'bg-orange-500';
    label = 'HIGH RISK';
  } else if (norm === 'critical') {
    bgClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50';
    dotClass = 'bg-red-500';
    label = 'CRITICAL';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-semibold gap-1.5',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 font-bold gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide whitespace-nowrap transition-colors ${sizeClasses[size]} ${bgClass} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && (norm === 'critical' || norm === 'high') && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClass}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotClass}`} />
      </span>
      {label}
    </span>
  );
};
