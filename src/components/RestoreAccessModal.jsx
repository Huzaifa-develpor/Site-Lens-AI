'use client';
import { useState } from 'react';
import { X, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestoreAccessModal({ isOpen, onClose, onVerified, onSubscribeInstead }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [noSubscriptionFound, setNoSubscriptionFound] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setErrorMsg('');
    setInfoMsg('');
    setNoSubscriptionFound(false);
    onClose();
  };

  const handleSendOtp = async () => {
    setErrorMsg('');
    setInfoMsg('');
    setNoSubscriptionFound(false);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (res.ok) {
        setInfoMsg('A 6-digit verification code has been sent to your email.');
        setStep('otp');
      } else {
        setErrorMsg(data.error || 'Failed to send code.');
        if (res.status === 404) {
          setNoSubscriptionFound(true);
        }
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMsg('');
    if (!otp || otp.length !== 6) {
      setErrorMsg('Enter the 6-digit code from your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sitelenis_email', data.email);
          if (data.auditId) {
            localStorage.setItem('sitelenis_last_auditId', data.auditId);
          }
        }
        onVerified?.(data);
        resetAndClose();
      } else {
        setErrorMsg(data.error || 'Invalid or expired code.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryDifferentEmail = () => {
    setEmail('');
    setErrorMsg('');
    setNoSubscriptionFound(false);
  };

  const handleGoSubscribe = () => {
    resetAndClose();
    onSubscribeInstead?.();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-[#0c0e12] border border-[#1e232d] rounded-2xl p-6 shadow-2xl"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetAndClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#12151b] border border-[#1e232d] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </motion.button>

          <div className="text-center mb-5">
            <div className="h-10 w-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              {step === 'email' ? <Mail className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <h3 className="text-lg font-bold text-white">
              {step === 'email' ? 'Restore Pro Access' : 'Enter Verification Code'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {step === 'email'
                ? 'Enter the email you subscribed with.'
                : `We sent a 6-digit code to ${email}.`}
            </p>
          </div>

          {step === 'email' ? (
            <>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#12151b] border border-[#1e232d] rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 mb-3 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendOtp}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#6366f1] hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Code'}
              </motion.button>

              {noSubscriptionFound && (
                <div className="mt-4 flex items-center justify-center gap-3 text-[11px]">
                  <button onClick={handleTryDifferentEmail} className="text-slate-400 hover:text-slate-300">
                    Try a different email
                  </button>
                  <span className="text-slate-700">•</span>
                  <button onClick={handleGoSubscribe} className="text-indigo-400 hover:text-indigo-300 font-semibold">
                    Subscribe now
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 bg-[#12151b] border border-[#1e232d] rounded-xl text-white placeholder-slate-500 text-center text-lg tracking-[0.3em] focus:outline-none focus:border-indigo-500 mb-3 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#6366f1] hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 mb-2"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
              </motion.button>
              <button
                onClick={() => setStep('email')}
                className="w-full py-2 text-[11px] text-slate-400 hover:text-slate-300"
              >
                Use a different email
              </button>
            </>
          )}

          {infoMsg && !errorMsg && (
            <p className="mt-3 text-[11px] text-emerald-400 text-center">{infoMsg}</p>
          )}
          {errorMsg && (
            <p className="mt-3 text-[11px] text-red-400 text-center">{errorMsg}</p>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}