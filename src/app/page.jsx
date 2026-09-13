'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AnalysisLoader from '@/components/AnalysisLoader';
import AuditReport from '@/components/AuditReport';
import WorkflowEngine from '@/components/WorkflowEngine';
import SubscriptionModal from '@/components/SubscriptionModal';
import RestoreAccessModal from '@/components/RestoreAccessModal';
import Toast from '@/components/Toast';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

function MainContent() {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [report, setReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [proData, setProData] = useState(null);
  const [toast, setToast] = useState(null);

  const loaderRef = useRef(null);
  const reportRef = useRef(null);

  const loadAuditStatus = async (auditId) => {
    if (!auditId) return;
    setIsCheckingStatus(true);
    try {
      const email =
        typeof window !== 'undefined' ? localStorage.getItem('sitelenis_email') : null;
      const qs = new URLSearchParams({ auditId, ...(email ? { email } : {}) });

      const res = await fetch(`/api/audit-status?${qs.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setReport({
          auditId: data.auditId,
          url: data.url,
          scores: data.scores,
          issues: data.issues,
        });
        setIsPro(data.isPro);
        setProData(data.isPro ? data.proIssues : null);

        if (typeof window !== 'undefined') {
          localStorage.setItem('sitelenis_last_auditId', data.auditId);
          // Self-correct: if this audit turned out to be Pro, always trust
          // the DB-confirmed email over whatever was typed at checkout —
          // fixes the case where the checkout-form email and the actual
          // Safepay payment-page email didn't match.
          if (data.isPro && data.email) {
            localStorage.setItem('sitelenis_email', data.email);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load audit status:', err);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    const urlAuditId = searchParams.get('auditId');
    const rememberedAuditId =
      typeof window !== 'undefined' ? localStorage.getItem('sitelenis_last_auditId') : null;

    const auditIdToLoad = urlAuditId || rememberedAuditId;
    if (auditIdToLoad) {
      loadAuditStatus(auditIdToLoad);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartAudit = async (url, options = {}) => {
    const { forceRefresh = false } = options;

    setIsLoading(true);
    setReport(null);
    setIsPro(false);
    setProData(null);
    setToast(null);

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, forceRefresh }),
      });
      const data = await res.json();

      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sitelenis_last_auditId', data.auditId);
        }
        await loadAuditStatus(data.auditId);

        setTimeout(() => {
          reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        if (data.errorCode === 'AI_BUSY') {
          setToast({
            title: 'Server is busy',
            message: 'Our AI service is currently busy. Please try again in a moment.',
          });
        } else if (data.errorCode === 'SITE_BLOCKED') {
          setToast({
            title: 'Website not accessible',
            message: "We couldn't access this website — it may be blocking automated tools. Please try a different URL.",
          });
        } else {
          setToast({
            title: 'Something went wrong',
            message: data.error || 'Failed to complete website audit. Please try again.',
          });
        }
      }
    } catch (err) {
      setToast({
        title: 'Network error',
        message: 'Unable to connect. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRerun = (url) => {
    handleStartAudit(url, { forceRefresh: true });
  };

  const handleShare = async (auditId) => {
    try {
      const shareUrl = `${window.location.origin}/?auditId=${auditId}`;
      await navigator.clipboard.writeText(shareUrl);
      setToast({
        variant: 'success',
        title: 'Link copied',
        message: 'The report link has been copied to your clipboard.',
      });
    } catch (err) {
      setToast({
        title: 'Could not copy link',
        message: 'Please copy the URL from your browser address bar instead.',
      });
    }
  };

  const handleRestoreVerified = (data) => {
    const auditIdToRefresh = data.auditId || report?.auditId;
    if (auditIdToRefresh) {
      loadAuditStatus(auditIdToRefresh);
    } else if (data.isPro) {
      setIsPro(true);
    }
  };

  const currentState = toast && toast.variant !== 'success'
    ? 'error'
    : isLoading || isCheckingStatus
    ? 'analyzing'
    : report
    ? (isPro ? 'pro_unlocked' : 'free_locked')
    : 'empty';

  return (
    <div className="min-h-screen bg-[#0c0e12] text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar onOpenUpgrade={() => setIsModalOpen(true)} currentState={currentState} />
        <main>
          <Hero onStartAudit={handleStartAudit} isLoading={isLoading} />

          <div className="text-center -mt-2 mb-4">
            <button
              onClick={() => setIsRestoreModalOpen(true)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              Already subscribed? Restore access
            </button>
          </div>

          <div ref={loaderRef}>
            {(isLoading || isCheckingStatus) && <AnalysisLoader />}
          </div>

          <div ref={reportRef}>
            {report && !isLoading && (
              <AuditReport
                report={report}
                isPro={isPro}
                proData={proData}
                onUnlockPro={() => setIsModalOpen(true)}
                onRerun={handleRerun}
                onShare={handleShare}
              />
            )}
          </div>

          <WorkflowEngine />
          <FAQ />
        </main>
      </div>

      <Footer onOpenUpgrade={() => setIsModalOpen(true)} />

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        auditId={report?.auditId}
        onRestoreAccess={() => {
          setIsModalOpen(false);
          setIsRestoreModalOpen(true);
        }}
      />

      <RestoreAccessModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onVerified={handleRestoreVerified}
        onSubscribeInstead={() => setIsModalOpen(true)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center p-12 text-slate-500 font-mono">Loading SiteLens AI...</div>}>
      <MainContent />
    </Suspense>
  );
}