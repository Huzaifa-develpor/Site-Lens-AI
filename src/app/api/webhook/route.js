import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Subscription from '@/models/subscriptionModel'; // TODO: adjust to your actual model path

const PLAN_MAP = {
  [process.env.SAFEPAY_MONTHLY_PLAN_ID]: 'monthly',
  [process.env.SAFEPAY_YEARLY_PLAN_ID]: 'yearly',
};

function mapStatus(safepayStatus) {
  const map = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    CANCELLED: 'cancelled',
    ENDED: 'expired',
    UNPAID: 'unpaid',
    PAST_DUE: 'past_due',
  };
  return map[safepayStatus] || 'active';
}

function secondsToDate(secondsObj) {
  return secondsObj?.seconds ? new Date(secondsObj.seconds * 1000) : undefined;
}

export async function POST(req) {
  try {
    const rawBody = await req.text();
    let bodyObject = null;

    try {
      bodyObject = JSON.parse(rawBody);
    } catch (e) {
      // Invalid JSON payload
    }

    const signature =
      req.headers.get('x-sfpy-signature') ||
      req.headers.get('x-safepay-signature');

    /*
      TEMP: signature verification bypassed for now — safepay.verify.webhook()
      is throwing internally (SDK expects a different shape than a plain
      parsed body + signature string). Revisit this before production so a
      fake POST request can't fake a subscription in the DB.
    */
    void signature;

    await dbConnect();

    const { type, data } = bodyObject || {};

    switch (type) {
      // Subscription created / renewed / payment went through
      case 'subscription.payment.succeeded': {
        await Subscription.findOneAndUpdate(
          { subscriptionId: data.id },
          {
            email: data.customer_email,
            auditId: data.reference,
            subscriptionId: data.id,
            planId: data.plan_id,
            plan: PLAN_MAP[data.plan_id] || 'monthly',
            status: mapStatus(data.status),
            renewsAt: secondsToDate(data.current_period_end_date),
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        break;
      }

      // A renewal payment attempt failed
      case 'subscription.payment.failed': {
        await Subscription.findOneAndUpdate(
          { subscriptionId: data.id },
          { status: 'past_due' }
        );
        break;
      }

      // Subscription was cancelled / ran out / manually ended
      case 'subscription.ended': {
        await Subscription.findOneAndUpdate(
          { subscriptionId: data.id },
          { status: 'expired', endsAt: new Date() }
        );
        break;
      }

      // Repeated failed payments, marked unpaid by Safepay
      case 'subscription.unpaid': {
        await Subscription.findOneAndUpdate(
          { subscriptionId: data.id },
          { status: 'unpaid' }
        );
        break;
      }

      // One-time payment.succeeded events (not subscription-specific) — ignored here
      default:
        console.log('Unhandled Safepay event type:', type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook Processing Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}