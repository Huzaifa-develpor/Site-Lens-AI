import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    // MongoDB TTL index — the document auto-deletes itself once expiresAt passes.
    // No cron job or manual cleanup needed.
    index: { expires: 0 },
  },
});

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);