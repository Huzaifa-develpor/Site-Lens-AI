'use client';
import { useEffect } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const isSuccess = toast?.variant === 'success';

  return (
    <AnimatePresence>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={
              isSuccess
                ? 'flex items-start gap-3 bg-[#12151b] border border-emerald-500/30 rounded-2xl p-4 shadow-2xl'
                : 'flex items-start gap-3 bg-[#12151b] border border-red-500/30 rounded-2xl p-4 shadow-2xl'
            }
          >
            <div
              className={
                isSuccess
                  ? 'h-8 w-8 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0'
                  : 'h-8 w-8 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0'
              }
            >
              {isSuccess ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-0.5">{toast.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white shrink-0 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}