'use client';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export default function AnalysisLoader() {
  const steps = [
    { label: 'Website discovered', done: true },
    { label: 'Content extracted', done: true },
    { label: 'Analyzing SEO & Metadata', active: true },
    { label: 'Checking UX & CTA Hierarchy', pending: true },
    { label: 'Evaluating Accessibility', pending: true },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-md mx-auto my-16 p-8 rounded-2xl glass-panel text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        // align-middle removes the default baseline gap that inline-block
        // SVGs get — without it, the rotation's center point drifts from
        // the icon's true visual center, which is what caused the wobble.
        className="inline-block align-middle mb-4"
      >
        <Loader2 className="h-8 w-8 text-indigo-500" />
      </motion.div>
      <h3 className="text-lg font-bold text-white mb-6">Analyzing your website...</h3>

      <div className="space-y-3 text-left">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.3 }}
            className="flex items-center gap-3 text-sm"
          >
            {step.done && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"
              >
                <Check className="h-3 w-3" />
              </motion.div>
            )}
            {step.active && (
              <div className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Loader2 className="h-3 w-3 animate-spin" />
              </div>
            )}
            {step.pending && (
              <div className="h-5 w-5 rounded-full bg-slate-800 border border-slate-700 shrink-0"></div>
            )}
            <span className={step.done ? 'text-slate-200' : step.active ? 'text-indigo-400 font-medium' : 'text-slate-500'}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}