import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useProject();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? AlertCircle
            : Info;

        const colorClasses =
          toast.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200'
            : toast.type === 'error'
            ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/80 dark:text-red-200'
            : 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/80 dark:text-blue-200';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm ${colorClasses}`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-relaxed">
                {toast.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};