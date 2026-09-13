import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    auditId: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: String,
    },
    subscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    planId: {
      type: String,
    },
    plan: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'paused', 'cancelled', 'expired', 'past_due', 'unpaid'],
      default: 'active',
    },
    renewsAt: {
      type: Date,
    },
    endsAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);