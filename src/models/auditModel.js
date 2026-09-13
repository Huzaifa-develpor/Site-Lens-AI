import mongoose from 'mongoose';

const AuditSchema = new mongoose.Schema({
  auditId: { type: String, required: true, unique: true, index: true },
  url: { type: String, required: true, index: true },
  scores: {
    overall: Number,
    seo: Number,
    ux: Number,
    accessibility: Number,
    content: Number,
    conversion: Number
  },
  freeIssues: [Object],
  proIssues: [Object], // Stored server-side, unlocked via verification
  // 24h TTL — MongoDB automatically deletes the document once this many
  // seconds pass since createdAt. This also naturally caps how long a
  // duplicate-URL cache hit (see /api/audit) stays valid.
  createdAt: { type: Date, default: Date.now, expires: '24h' }
});

export default mongoose.models.Audit || mongoose.model('Audit', AuditSchema);