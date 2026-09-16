import { NextResponse } from 'next/server';
import { erinnerungRepository } from '@/lib/repositories/erinnerung-repository';
import { ErinnerungUpdateSchema } from '@/validators/erinnerung-schema';
import { requireAuth } from '@/lib/session-utils';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    const { id } = await params;
    const erinnerung = await erinnerungRepository.getById(id, session.userId);
    if (!erinnerung) return NextResponse.json({ error: 'Erinnerung nicht gefunden' }, { status: 404 });

    return NextResponse.json(erinnerung);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden der Erinnerung' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const parsed = ErinnerungUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const erinnerung = await erinnerungRepository.update(id, session.userId, parsed.data);
    if (!erinnerung) return NextResponse.json({ error: 'Erinnerung nicht gefunden' }, { status: 404 });

    return NextResponse.json(erinnerung);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Aktualisieren der Erinnerung' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    const { id } = await params;
    const deleted = await erinnerungRepository.delete(id, session.userId);
    if (!deleted) return NextResponse.json({ error: 'Erinnerung nicht gefunden' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Löschen der Erinnerung' }, { status: 500 });
  }
}
