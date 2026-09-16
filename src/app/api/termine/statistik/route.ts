import { NextResponse } from 'next/server';
import { terminRepository } from '@/lib/repositories/termin-repository';
import { requireAuth } from '@/lib/session-utils';

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    // Repository liefert die Aggregation (groupBy) direkt als Record.
    const counts = await terminRepository.getStatistik(session.userId);
    return NextResponse.json(counts);
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden der Statistik' }, { status: 500 });
  }
}
