import prisma from '@/lib/prisma';
import type { Erinnerung, ErinnerungCreateInput, ErinnerungUpdateInput } from '@/types/erinnerung';

/** Prisma-Rohform einer Erinnerung inkl. zugehoerigem Termin. */
type PrismaErinnerung = {
  id: string;
  terminId: string;
  erinnerung: string;
  datum: Date;
  uhrzeit: string;
  beschreibung: string | null;
  userId: string;
  createdAt: Date;
  termin: { id: string; titel: string };
};

/**
 * Wandelt ein Prisma-Erinnerungs-Objekt in den API-Datensatz um.
 * `datum` wird als YYYY-MM-DD-String serialisiert (lokales Datum, UTC-Mitternacht).
 */
function serializeErinnerung(e: PrismaErinnerung): Erinnerung {
  return {
    id: e.id,
    terminId: e.terminId,
    erinnerung: e.erinnerung,
    datum: e.datum.toISOString().slice(0, 10),
    uhrzeit: e.uhrzeit,
    beschreibung: e.beschreibung,
    userId: e.userId,
    createdAt: e.createdAt.toISOString(),
    termin: { id: e.termin.id, titel: e.termin.titel },
  };
}

export const erinnerungRepository = {
  async getAll(userId: string): Promise<Erinnerung[]> {
    const erinnerungen = await prisma.erinnerung.findMany({
      where: { userId },
      orderBy: { datum: 'asc' },
      include: { termin: true },
    });
    return erinnerungen.map(serializeErinnerung);
  },

  async getById(id: string, userId: string): Promise<Erinnerung | null> {
    const erinnerung = await prisma.erinnerung.findFirst({
      where: { id, userId },
      include: { termin: true },
    });
    return erinnerung ? serializeErinnerung(erinnerung) : null;
  },

  async create(userId: string, data: ErinnerungCreateInput): Promise<Erinnerung> {
    const erinnerung = await prisma.erinnerung.create({
      // Unchecked-Input: skalare FKs (userId, terminId) statt Relation-Connects.
      data: {
        terminId: data.terminId,
        erinnerung: data.erinnerung,
        datum: new Date(data.datum),
        uhrzeit: data.uhrzeit,
        beschreibung: data.beschreibung ?? null,
        userId,
      },
      include: { termin: true },
    });
    return serializeErinnerung(erinnerung);
  },

  async update(id: string, userId: string, data: ErinnerungUpdateInput): Promise<Erinnerung | null> {
    const existing = await this.getById(id, userId);
    if (!existing) return null;

    const erinnerung = await prisma.erinnerung.update({
      where: { id },
      data: {
        ...(data.terminId !== undefined && { terminId: data.terminId }),
        ...(data.erinnerung !== undefined && { erinnerung: data.erinnerung }),
        ...(data.datum !== undefined && { datum: new Date(data.datum) }),
        ...(data.uhrzeit !== undefined && { uhrzeit: data.uhrzeit }),
        ...(data.beschreibung !== undefined && { beschreibung: data.beschreibung ?? existing.beschreibung }),
      },
      include: { termin: true },
    });
    return serializeErinnerung(erinnerung);
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await prisma.erinnerung.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  },
};
