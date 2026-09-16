import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Logout fehlgeschlagen' }, { status: 500 });
  }
}
