import { NextResponse } from 'next/server';
import { terminRepository } from '@/lib/repositories/termin-repository';
import { TerminUpdateSchema } from '@/validators/termin-schema';
import { requireAuth } from '@/lib/session-utils';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    const { id } = await params;
    const termin = await terminRepository.getById(id, session.userId);
    if (!termin) return NextResponse.json({ error: 'Termin nicht gefunden' }, { status: 404 });

    return NextResponse.json(termin);
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden des Termins' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const parsed = TerminUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const termin = await terminRepository.update(id, session.userId, parsed.data);
    if (!termin) return NextResponse.json({ error: 'Termin nicht gefunden' }, { status: 404 });

    return NextResponse.json(termin);
  } catch {
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Termins' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    if (!session) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

    const { id } = await params;
    const deleted = await terminRepository.delete(id, session.userId);
    if (!deleted) return NextResponse.json({ error: 'Termin nicht gefunden' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Löschen des Termins' }, { status: 500 });
  }
}
