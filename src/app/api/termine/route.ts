import { NextResponse } from 'next/server';
import { terminRepository } from '@/lib/repositories/termin-repository';
import { TerminCreateSchema } from '@/validators/termin-schema';
import { requireAuth } from '@/lib/session-utils';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    let termine;
    if (startDate && endDate) {
      termine = await terminRepository.getByDateRange(session.userId, startDate, endDate);
    } else {
      termine = await terminRepository.getAll(session.userId);
    }

    return NextResponse.json(termine);
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden der Termine' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = TerminCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const termin = await terminRepository.create(session.userId, parsed.data);
    return NextResponse.json(termin, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Erstellen des Termins' }, { status: 500 });
  }
}
