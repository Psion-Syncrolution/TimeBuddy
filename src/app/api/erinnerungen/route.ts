import { NextResponse } from 'next/server';
import { erinnerungRepository } from '@/lib/repositories/erinnerung-repository';
import { ErinnerungSchema } from '@/validators/erinnerung-schema';
import { requireAuth } from '@/lib/session-utils';

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    const erinnerungen = await erinnerungRepository.getAll(session.userId);
    return NextResponse.json(erinnerungen);
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden der Erinnerungen' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    const body = await req.json();
    const parsed = ErinnerungSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const erinnerung = await erinnerungRepository.create(session.userId, parsed.data);
    return NextResponse.json(erinnerung, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Erstellen der Erinnerung' }, { status: 500 });
  }
}
