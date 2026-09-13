'use client';
import { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubscriptionModal({ isOpen, onClose, auditId, onRestoreAccess }) {
  const [email, setEmail] = useState('');
  const [loadingTier, setLoadingTier] = useState(null); // 'monthly' | 'yearly' | null
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (tier) => {
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address to link your Pro plan.');
      return;
    }

    if (!auditId) {
      setErrorMsg('Audit ID reference missing. Please run an audit first.');
      return;
    }

    setLoadingTier(tier);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: tier,
          tier: tier,
          email: cleanEmail,
          auditId: auditId,
        }),
      });

      const data = await res.json();

      if (data.url) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sitelenis_email', cleanEmail);
          localStorage.setItem('sitelenis_last_auditId', auditId);
        }

        window.location.assign(data.url);
      } else {
        setErrorMsg(data.error || 'Checkout initialization failed.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrorMsg('Unable to connect to payment server.');
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-center p-4 overflow-y-auto pt-16 pb-12"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-[#0c0e12] border border-[#1e232d] rounded-2xl p-6 sm:p-8 shadow-2xl my-auto"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 h-9 w-9 rounded-full bg-[#12151b] border border-[#1e232d] text-slate-400 hover:text-white flex items-center justify-center transition-colors z-20"
            >
              <X className="h-4 w-4" />
            </motion.button>

            <div className="text-center mb-6">
              <div className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase mb-1">
                TRANSPARENT TIERING
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Simple pricing. Clear improvements.
              </h2>
              <p className="text-xs text-slate-400">
                Upgrade when you want actionable fixes, step-by-step code remedies, and unlimited scans.
              </p>
              {onRestoreAccess && (
                <button
                  onClick={onRestoreAccess}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors mt-2"
                >
                  Already subscribed? Restore access
                </button>
              )}
            </div>

            {/* Email Input Field Section */}
            <div className="max-w-md mx-auto mb-6 text-left">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Email <span className="text-indigo-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#12151b] border border-[#1e232d] rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Your Pro subscription and reports will be linked to this email address.
              </p>
              <p className="text-[11px] text-amber-400/90 mt-1.5 leading-relaxed">
                ⚠ Important: on the next screen (Safepay), enter this exact same email — a different email there will not link back to your reports automatically.
              </p>

              {/* Validation Error Message Display */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-[11px] text-red-400 font-medium bg-red-950/40 border border-red-900/50 rounded-lg p-2 text-center"
                >
                  {errorMsg}
                </motion.div>
              )}
            </div>

            {/* Modal Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {/* Pro Monthly */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-[#12151b] border-2 border-indigo-500 relative flex flex-col justify-between shadow-2xl"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-400 text-[#0c0e12] text-[10px] font-mono font-bold tracking-wider uppercase">
                  MOST POPULAR
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Pro Monthly</h3>
                  <p className="text-xs text-slate-400 mb-3">Engineered for indie hackers, founders, and growth engineers.</p>
                  <div className="text-3xl font-extrabold text-white mb-4">$9 <span className="text-xs font-normal text-slate-400">/ month</span></div>

                  <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                    <li className="flex items-center gap-2 font-bold"><Check className="h-4 w-4 text-emerald-400" /> All Free features included</li>
                    <li className="flex items-center gap-2 font-bold"><Check className="h-4 w-4 text-emerald-400" /> Detailed AI fixes & code snippets</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Step-by-step why-it-matters rationale</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Unlimited website audits</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> JSON / Markdown report exports</li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubscribe('monthly')}
                  disabled={loadingTier !== null}
                  className="w-full py-2.5 rounded-xl bg-[#6366f1] hover:bg-indigo-500 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loadingTier === 'monthly' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    'Get Pro Monthly'
                  )}
                </motion.button>
              </motion.div>

              {/* Pro Yearly */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-2xl bg-[#12151b] border border-[#1e232d] flex flex-col justify-between relative"
              >
                <span className="absolute top-6 right-6 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px] font-mono font-bold">SAVE 27%</span>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Pro Yearly</h3>
                  <p className="text-xs text-slate-400 mb-3">Best value for agencies and long-term projects.</p>
                  <div className="text-3xl font-extrabold text-white mb-4">$79 <span className="text-xs font-normal text-slate-400">/ year (~$6.58/mo)</span></div>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Everything in Pro Monthly</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Priority AI GPU processing queue</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Continuous weekly automated crawls</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Multiple custom domain alerts</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Direct Discord & Email architect support</li>
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubscribe('yearly')}
                  disabled={loadingTier !== null}
                  className="w-full py-2.5 rounded-xl bg-[#1a1f29] hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-[#2a303c] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loadingTier === 'yearly' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    'Choose Yearly'
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}