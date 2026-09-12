'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-20 right-6 z-[999999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-right-5 fade-in ${
              isError
                ? 'bg-rose-50/98 border-rose-400 text-rose-950 shadow-rose-500/20'
                : isSuccess
                ? 'bg-emerald-50/98 border-emerald-400 text-emerald-950 shadow-emerald-500/20'
                : isWarning
                ? 'bg-amber-50/98 border-amber-400 text-amber-950 shadow-amber-500/20'
                : 'bg-white/98 border-slate-300 text-navy-900 shadow-slate-500/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0 mt-0.5">
                {isError ? '⚠️' : isSuccess ? '✅' : isWarning ? '⚡' : 'ℹ️'}
              </span>
              <div className="text-xs font-bold leading-relaxed pr-2">
                {toast.message}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 shrink-0 text-base font-bold cursor-pointer p-0.5"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
};
