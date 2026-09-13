import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Otp from '@/models/Otpmodel';
import Subscription from '@/models/subscriptionModel'; // TODO: confirm this matches your actual file/path

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    await dbConnect();

    const otpRecord = await Otp.findOne({ email: cleanEmail, otp });

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 401 });
    }

    // OTP was correct and matched — consume it so it can't be reused
    await Otp.deleteOne({ _id: otpRecord._id });

    const subscription = await Subscription.findOne({
      email: cleanEmail,
      status: 'active',
    }).lean();

    return NextResponse.json({
      verified: true,
      isPro: !!subscription,
      email: cleanEmail,
      auditId: subscription?.auditId || null,
      plan: subscription?.plan || null,
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json({ error: 'Failed to verify code.' }, { status: 500 });
  }
}