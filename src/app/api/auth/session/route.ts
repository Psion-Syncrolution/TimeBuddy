import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: { userId: session.userId, email: session.email } });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
