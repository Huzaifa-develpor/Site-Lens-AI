'use client';
import { motion } from 'framer-motion';

export default function Footer({ onOpenUpgrade }) {
  return (
    <footer className="border-t border-[#1e232d] py-12 px-6 bg-[#090b0e] text-xs text-slate-400">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <div className="font-bold text-white text-sm mb-1">SiteLens AI</div>
          <p className="text-slate-500">AI-powered website optimization.</p>
        </div>

        <div className="flex gap-12 text-slate-400 font-medium text-[11px]">
          <div>
            <div className="font-mono text-slate-300 font-bold mb-2 uppercase">PRODUCT</div>
            <div className="space-y-1">
              <div><a href="#how-it-works" className="hover:text-white transition-colors">Features</a></div>
              <div>
                <button onClick={onOpenUpgrade} className="hover:text-white cursor-pointer transition-colors">
                  Pricing
                </button>
              </div>
              <div><a href="#faq" className="hover:text-white transition-colors">FAQ</a></div>
            </div>
          </div>
          <div>
            <div className="font-mono text-slate-300 font-bold mb-2 uppercase">LEGAL</div>
            <div className="space-y-1">
              <div><a href="#" className="hover:text-white transition-colors">Privacy</a></div>
              <div><a href="#" className="hover:text-white transition-colors">Terms</a></div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#1e232d]/60 text-[11px]"
      >
        <div>© 2026 SiteLens AI. All rights reserved.</div>
        <div className="font-mono text-emerald-400 flex items-center gap-1.5">
          <motion.span 
            animate={{ opacity: [1, 0.4, 1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ●
          </motion.span> 
          All Systems Telemetry Operational
        </div>
      </motion.div>
    </footer>
  );
}