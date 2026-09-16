import { NextResponse } from 'next/server';
import { terminRepository } from '@/lib/repositories/termin-repository';
import { requireAuth } from '@/lib/session-utils';

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    const statistik = await terminRepository.getStatistik(session.userId);
    const counts: Record<string, number> = {};
    for (const item of statistik) {
      counts[item.datum] = item.count;
    }

    return NextResponse.json(counts);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden der Statistik' }, { status: 500 });
  }
}
