'use client';
import { Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';

const STATES = [
  { key: 'empty', label: '1. EMPTY / READY' },
  { key: 'analyzing', label: '2. ANALYZING (LIVE)' },
  { key: 'free_locked', label: '3. FREE REPORT (LOCKED PRO)' },
  { key: 'pro_unlocked', label: '4. PRO UNLOCKED REPORT' },
  { key: 'error', label: '5. ERROR STATE' },
];

export default function Navbar({ onOpenUpgrade, currentState = 'empty' }) {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-[#1e232d] bg-[#0c0e12] sticky top-0 z-40"
    >
      {/* Top Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="h-7 w-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center"
          >
            <Zap className="h-4 w-4" />
          </motion.div>
          <span className="font-bold text-base tracking-tight text-white">SiteLens AI</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">BETA</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#hero" className="hover:text-white transition-colors">Features</a>
          <button onClick={onOpenUpgrade} className="hover:text-white cursor-pointer transition-colors">Pricing</button>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenUpgrade}
            className="px-3.5 py-2 rounded-lg bg-[#6366f1] hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all whitespace-nowrap"
          >
            Upgrade to Pro
          </motion.button>
          <div className="h-8 w-8 rounded-full bg-[#1e232d] flex items-center justify-center text-slate-300 shrink-0">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Interactive Preview State Bar */}
      <div className="border-t border-[#1e232d] bg-[#090b0e] py-2 px-4 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-400 min-w-[650px]">
          <span className="flex items-center gap-2 text-slate-400 font-semibold shrink-0">
            <span>⚙</span> INTERACTIVE PREVIEW STATE:
          </span>
          <div className="flex items-center gap-2">
            {STATES.map((s) => {
              const isActive = s.key === currentState;
              const isError = s.key === 'error';
              return (
                <motion.span
                  key={s.key}
                  animate={{ scale: isActive ? 1.02 : 1 }}
                  className={
                    isActive
                      ? isError
                        ? 'px-2 py-0.5 rounded bg-red-950/50 text-red-400 border border-red-500/40'
                        : 'px-2 py-0.5 rounded bg-[#1e232d] text-white border border-indigo-500/50'
                      : 'px-2 py-0.5 rounded text-slate-500'
                  }
                >
                  {s.label}
                </motion.span>
              );
            })}
          </div>
        </div>
      </div>
    </motion.header>
  );
}