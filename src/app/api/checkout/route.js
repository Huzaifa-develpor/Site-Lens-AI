import { NextResponse } from 'next/server';
import { verifySafepayWebhook } from '@/lib/safepay';

export async function POST(req) {
  try {
    const body = await req.json();
    const { plan, tier, auditId, email } = body;

    const targetPlan = plan || tier || 'monthly';

    let planId;
    if (targetPlan === 'yearly') {
      planId = process.env.SAFEPAY_YEARLY_PLAN_ID;
    } else {
      planId = process.env.SAFEPAY_MONTHLY_PLAN_ID;
    }

    if (!planId) {
      return NextResponse.json(
        { error: 'Subscription plan ID is not configured on the server.' },
        { status: 400 }
      );
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin')
    const reference = auditId || `audit_${Date.now()}`;
    const redirectUrl = `${origin}/?auditId=${reference}&payment=success`;
    const cancelUrl = `${origin}/?auditId=${reference}&payment=cancelled`;

    const checkoutUrl = await verifySafepayWebhook({
      planId,
      reference,
      cancelUrl,
      redirectUrl,
      email,
    });

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Failed to generate checkout session from Safepay.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl, success: true });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Unable to start Safepay checkout. Please try again.' },
      { status: 500 }
    );
  }
}