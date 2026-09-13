import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { resend } from '@/lib/resend';
import Otp from '@/models/Otpmodel';
import Subscription from '@/models/subscriptionModel'; // TODO: confirm this matches your actual file/path

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    await dbConnect();

    const subscription = await Subscription.findOne({
      email: cleanEmail,
      status: 'active',
    }).lean();

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found for this email address.' },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Remove any older unused OTPs for this email first
    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({ email: cleanEmail, otp, expiresAt });

    await resend.emails.send({
      from: 'SiteLens AI <onboarding@resend.dev>', // TODO: switch to your verified domain later
      to: cleanEmail,
      subject: 'Your SiteLens AI verification code',
      html: `
        <div style="font-family: sans-serif; max-width: 420px; margin: 0 auto;">
          <h2>Your verification code</h2>
          <p>Enter this code to restore your Pro access:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
          <p style="color: #888; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    console.error('Request OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send verification code.' }, { status: 500 });
  }
}