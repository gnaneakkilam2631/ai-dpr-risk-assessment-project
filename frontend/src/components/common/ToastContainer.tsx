import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useProject();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        let icon = <Info className="h-5 w-5 text-blue-500 shrink-0" />;
        let borderClass = 'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900';

        if (t.type === 'success') {
          icon = <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
          borderClass = 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900';
        } else if (t.type === 'warning') {
          icon = <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
          borderClass = 'border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900';
        } else if (t.type === 'error') {
          icon = <XCircle className="h-5 w-5 text-rose-500 shrink-0" />;
          borderClass = 'border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900';
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.title}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                {t.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
