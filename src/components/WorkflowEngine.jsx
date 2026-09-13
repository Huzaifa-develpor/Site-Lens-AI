'use client';
import { motion } from 'framer-motion';

export default function WorkflowEngine() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-20 text-center border-t border-[#1e232d]/50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-[11px] font-mono text-indigo-400 tracking-wider uppercase mb-2">WORKFLOW ENGINE</div>
        <h2 className="text-3xl font-bold text-white mb-2">How SiteLens AI Works</h2>
        <p className="text-xs text-slate-400 mb-12">Autonomous diagnosis to production-ready deployment in three simple phases.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
      >
        {/* Step 1 */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="p-6 rounded-2xl bg-[#12151b] border border-[#1e232d] flex flex-col justify-between space-y-6"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-mono text-slate-600 font-bold">01</span>
              <div className="h-8 w-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-indigo-400">➔</div>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Enter your URL</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste your public website or landing page link. No installation, tracking script injection, or DNS records needed.
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400">● Zero integration overhead</div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="p-6 rounded-2xl bg-[#12151b] border border-[#1e232d] flex flex-col justify-between space-y-6"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-mono text-slate-600 font-bold">02</span>
              <div className="h-8 w-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-cyan-400">⚙</div>
            </div>
            <h3 className="text-base font-bold text-white mb-2">AI analyzes it</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              SiteLens scans the DOM, parses metadata, checks contrast ratio compliance, and evaluates conversion copy readability.
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400">● 60+ heuristic vector checks</div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="p-6 rounded-2xl bg-[#12151b] border border-[#1e232d] flex flex-col justify-between space-y-6"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-mono text-slate-600 font-bold">03</span>
              <div className="h-8 w-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-emerald-400">&lt;/&gt;</div>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Fix what matters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get clear explanations, impact metrics, and copy-paste code snippets so you can deploy improvements immediately.
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400">● Instant code generation</div>
        </motion.div>
      </motion.div>
    </section>
  );
}