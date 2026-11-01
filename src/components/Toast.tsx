import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';
        let borderColor = 'border-emerald-500/30';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
          borderColor = 'border-rose-500/30';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-cyan-400';
          borderColor = 'border-cyan-500/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-2xl backdrop-blur-md border ${borderColor} bg-[#161b22]/95 light:bg-white/95 text-slate-100 light:text-slate-900 transition-all transform animate-in slide-in-from-bottom-3 duration-200`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h4 className="text-xs font-bold">{toast.title}</h4>
                <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-200 light:hover:text-slate-600 transition-colors -mr-1 -mt-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
