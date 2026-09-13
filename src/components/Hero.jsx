'use client';
import { useState } from 'react';
import { Globe, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ onStartAudit, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) onStartAudit(url);
  };

  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="px-4 text-center max-w-4xl mx-auto flex flex-col justify-center min-h-[calc(100vh-140px)] py-8"
    >
      {/* Top Active Telemetry Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-[11px] mono-badge mb-6 font-mono self-center"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        SITELENS CORE 3.4 ACTIVE • MULTI-VECTOR TELEMETRY
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight sm:leading-none mb-4"
      >
        Find out what’s wrong with <br className="hidden sm:inline" /> your website.
      </motion.h1>

      {/* Paragraph Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed"
      >
        AI analyzes your website and identifies SEO, UX, accessibility, content, and conversion issues — in seconds.
      </motion.p>

      {/* Input Box Frame */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-2xl mx-auto w-full mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center bg-[#12151b] border border-[#1e232d] rounded-2xl p-2 gap-2 shadow-2xl transition-all focus-within:border-indigo-500/50">
          <div className="flex items-center w-full px-3 py-1">
            <Globe className="h-4 w-4 text-slate-500 mr-2 shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={isLoading}
              className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#6366f1] hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : '✦ Analyze Website'}
          </motion.button>
        </div>
      </motion.form>

      {/* Sub-Badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] text-slate-400 font-medium"
      >
        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-emerald-400" /> Free instant audit
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-emerald-400" /> No signup required
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono">
          ● Powered by Gemini & LLM heuristics
        </span>
      </motion.div>
    </motion.section>
  );
}