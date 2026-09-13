import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subscription from '@/models/Subscription';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const auditId = searchParams.get('auditId');
    const email = searchParams.get('email');

    if (!auditId && !email) {
      return NextResponse.json({ isPro: false });
    }

    await dbConnect();

    const queryConditions = [];
    if (auditId) queryConditions.push({ auditId });
    if (email) queryConditions.push({ email });

    const subscription = await Subscription.findOne({
      $or: queryConditions,
      status: 'active',
    });

    if (subscription) {
      return NextResponse.json({
        isPro: true,
        plan: subscription.plan,
        renewsAt: subscription.renewsAt,
      });
    }

    return NextResponse.json({ isPro: false });
  } catch (error) {
    console.error('Subscription verification error:', error);
    return NextResponse.json({ isPro: false, error: 'Database query failed' }, { status: 500 });
  }
}