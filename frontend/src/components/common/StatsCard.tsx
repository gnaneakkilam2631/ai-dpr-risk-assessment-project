import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  id?: string;
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    isPositive?: boolean;
  };
  highlightColor?: 'blue' | 'amber' | 'emerald' | 'rose' | 'purple';
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  id,
  title,
  value,
  description,
  icon,
  trend,
  highlightColor = 'blue',
  onClick,
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    emerald: 'bg-green-50 text-green-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    rose: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white p-4 rounded-xl border border-slate-200 shadow-xs transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-[#0c1427] dark:hover:border-slate-700 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-1.5 rounded-lg flex items-center justify-center ${colorMap[highlightColor]}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={`text-[10px] font-semibold flex items-center gap-0.5 ${
              trend.direction === 'up'
                ? trend.isPositive
                  ? 'text-green-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-rose-400'
                : trend.direction === 'down'
                ? trend.isPositive
                  ? 'text-green-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-rose-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>

      {description && (
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
          {description}
        </p>
      )}
    </div>
  );
};

