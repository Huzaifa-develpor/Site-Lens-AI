'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does SiteLens AI analyze my website?",
    answer: "SiteLens AI fetches your site's public DOM, metadata, styles, and structural hierarchy. It then runs these details through advanced LLM heuristics and rule-based diagnostic engines to evaluate SEO integrity, UX clarity, contrast compliance, and conversion bottlenecks."
  },
  {
    question: "Do I need to install any tracking scripts or snippets on my site?",
    answer: "No integration is required. You don't need to paste any tracking pixel, npm package, or script into your codebase. Just enter your public URL, and our system performs a non-invasive autonomous audit instantly."
  },
  {
    question: "What is the difference between the Free report and Pro unlock?",
    answer: "The Free report identifies high-level site issues, accessibility flags, and performance warnings. Upgrading to Pro unlocks step-by-step technical explanations, actionable code snippets (React/Tailwind/HTML), rationale breakdowns, and unlimited audit exports."
  },
  {
    question: "Can I audit password-protected or local development sites (localhost)?",
    answer: "Currently, SiteLens AI requires a publicly accessible URL to fetch and parse the DOM. For staging or localhost environments, you can use tunneling tools like ngrok to expose your local URL temporarily for testing."
  },
  {
    question: "How long does a single analysis take?",
    answer: "Most audits complete in under 10–15 seconds depending on your site's structure and response time. Our GPU-accelerated AI pipeline processes multi-vector telemetry in real time."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <div className="text-[10px] font-mono text-indigo-400 tracking-wider uppercase mb-1">
          QUESTIONS & ANSWERS
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-slate-400">
          Everything you need to know about SiteLens AI and how our auditing works.
        </p>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="bg-[#12151b] border border-[#1e232d] rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
              >
                <span>{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 ml-2"
                >
                  <ChevronDown
                    className={`h-4 w-4 ${isOpen ? 'text-indigo-400' : 'text-slate-400'}`}
                  />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-[#1e232d]/50 pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}