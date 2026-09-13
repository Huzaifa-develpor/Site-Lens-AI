'use client';
import { motion } from 'framer-motion';
import { RefreshCw, Share2, Lock, Search, MousePointer, Accessibility, FileText, TrendingUp } from 'lucide-react';

export default function AuditReport({ report, isPro, proData, onUnlockPro, onRerun, onShare }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-8 space-y-6"
    >
      {/* 1. Header Frame */}
      <motion.div variants={itemVariants} className="flex items-center justify-between p-6 rounded-2xl bg-[#12151b] border border-[#1e232d]">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white tracking-tight">Website Audit Report</h2>
          <span className="px-2.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono">● Audited just now</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onRerun?.(report.url)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1f29] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-[#2a303c] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-run Audit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onShare?.(report.auditId)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1f29] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-[#2a303c] transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </motion.button>
        </div>
      </motion.div>

      {/* 2. Score Cards Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 p-8 rounded-2xl bg-[#12151b] border border-[#1e232d] text-center flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="68" stroke="#1e232d" strokeWidth="10" fill="transparent" />
              <motion.circle 
                cx="80" 
                cy="80" 
                r="68" 
                stroke="#38bdf8" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray={427} 
                initial={{ strokeDashoffset: 427 }}
                animate={{ strokeDashoffset: 427 - (427 * report.scores.overall) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold text-white">{report.scores.overall}</span>
              <span className="block text-xs text-slate-400 font-mono mt-0.5">/ 100</span>
            </div>
          </div>
          <h3 className="text-base font-bold text-white mb-2">Website Health Score</h3>
          <span className="px-3 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold tracking-wider uppercase mb-3">NEEDS OPTIMIZATION</span>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">5 high-priority issues detected across accessibility, meta tags, and visual hierarchy.</p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#12151b] border border-[#1e232d]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-white text-sm font-bold"><Search className="h-4 w-4 text-slate-400" /> SEO</div>
              <span className="text-amber-400 text-xs font-mono font-bold">{report.scores.seo}/100</span>
            </div>
            <div className="w-full bg-[#1e232d] h-2 rounded-full mb-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${report.scores.seo}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-amber-400 h-2 rounded-full" 
              />
            </div>
            <p className="text-xs text-slate-400">Weak meta description and canonical redirects.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12151b] border border-[#1e232d]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-white text-sm font-bold"><MousePointer className="h-4 w-4 text-slate-400" /> UX</div>
              <span className="text-emerald-400 text-xs font-mono font-bold">{report.scores.ux}/100</span>
            </div>
            <div className="w-full bg-[#1e232d] h-2 rounded-full mb-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${report.scores.ux}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-emerald-400 h-2 rounded-full" 
              />
            </div>
            <p className="text-xs text-slate-400">CTA contrast ambiguity and banner clustering.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12151b] border border-[#1e232d]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-white text-sm font-bold"><Accessibility className="h-4 w-4 text-slate-400" /> Accessibility</div>
              <span className="text-amber-400 text-xs font-mono font-bold">{report.scores.accessibility}/100</span>
            </div>
            <div className="w-full bg-[#1e232d] h-2 rounded-full mb-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${report.scores.accessibility}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-amber-400 h-2 rounded-full" 
              />
            </div>
            <p className="text-xs text-slate-400">Missing img alt tags and focus outlines.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#12151b] border border-[#1e232d]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-white text-sm font-bold"><FileText className="h-4 w-4 text-slate-400" /> Content</div>
              <span className="text-emerald-400 text-xs font-mono font-bold">{report.scores.content}/100</span>
            </div>
            <div className="w-full bg-[#1e232d] h-2 rounded-full mb-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${report.scores.content}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-emerald-400 h-2 rounded-full" 
              />
            </div>
            <p className="text-xs text-slate-400">Headline value proposition readability.</p>
          </div>

          <div className="md:col-span-2 p-5 rounded-2xl bg-[#12151b] border border-[#1e232d]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-white text-sm font-bold"><TrendingUp className="h-4 w-4 text-slate-400" /> Conversion Rate Optimization</div>
              <span className="text-amber-400 text-xs font-mono font-bold">{report.scores.conversion}/100</span>
            </div>
            <div className="w-full bg-[#1e232d] h-2 rounded-full mb-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${report.scores.conversion}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-amber-400 h-2 rounded-full" 
              />
            </div>
            <p className="text-xs text-slate-400">Friction in checkout entry points; social proof elements missing above the fold line.</p>
          </div>
        </div>
      </motion.div>

      {/* 3. What We Found Section */}
      <motion.div variants={itemVariants} className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">What We Found</h3>
            <p className="text-xs text-slate-400">Identified structural bottlenecks requiring architectural and design remediation.</p>
          </div>
          <span className="text-xs font-mono text-amber-400">● {report.issues.length} Issues Found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.issues.map((issue, idx) => {
            const proFix = isPro && proData ? proData.find((p) => p.id === issue.id) : null;

            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                whileHover={{ y: -3 }}
                className="p-6 rounded-2xl bg-[#12151b] border border-[#1e232d] flex flex-col justify-between space-y-4 transition-shadow hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 uppercase">{issue.category}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/20">Needs improvement</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{issue.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{issue.problem}</p>

                  {proFix && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-[#1e232d]/60 space-y-3"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Why it matters</span>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{proFix.whyItMatters}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">How to fix</span>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{proFix.howToFix}</p>
                      </div>
                      {proFix.recommendation && (
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Recommendation</span>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{proFix.recommendation}</p>
                        </div>
                      )}
                      {proFix.codeExample && (
                        <pre className="text-[11px] bg-[#0c0e12] border border-[#1e232d] rounded-lg p-3 overflow-x-auto text-emerald-300">
                          <code>{proFix.codeExample}</code>
                        </pre>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1e232d]/60 text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">Impact: High CTR Loss</span>
                  {!proFix && (
                    <motion.button 
                      whileHover={{ x: 3 }}
                      onClick={onUnlockPro} 
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      View fix in Pro →
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 4. Locked Pro Frame */}
      {!isPro && (
        <motion.div 
          variants={itemVariants}
          className="relative rounded-2xl bg-[#12151b] border border-[#1e232d] p-12 overflow-hidden my-8 text-center"
        >
          <div className="space-y-4 filter blur-md opacity-20 pointer-events-none select-none">
            <div className="h-12 bg-slate-800 rounded-xl w-full"></div>
            <div className="h-12 bg-slate-800 rounded-xl w-full"></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg w-full bg-[#0c0e12] border border-[#1e232d] rounded-2xl p-8 text-center shadow-2xl"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Get the exact fixes</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm mx-auto">
                Upgrade to Pro to see exactly how to fix every issue, why it matters, and what you should change in your code and copy.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onUnlockPro}
                className="w-full py-3 rounded-xl bg-[#6366f1] hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-all mb-3"
              >
                <Lock className="h-4 w-4" /> Unlock Detailed Fixes
              </motion.button>
              <div className="text-[10px] font-mono text-slate-500 tracking-wider">
                INSTANT UNLOCK • GET UNLIMITED DETAILED RECOMMENDATIONS
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}