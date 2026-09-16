import prisma from '@/lib/prisma';
import type { Termin, TerminCreateInput, TerminUpdateInput } from '@/types/termin';

/** Prisma-Rohform eines Termins (vor Serialisierung). */
type PrismaTermin = {
  id: string;
  titel: string;
  datum: Date;
  uhrzeit: string;
  beschreibung: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Wandelt ein Prisma-Termin-Objekt in den API-Datensatz um.
 * `datum` wird als YYYY-MM-DD-String serialisiert (lokales Datum, UTC-Mitternacht).
 */
function serializeTermin(t: PrismaTermin): Termin {
  return {
    id: t.id,
    titel: t.titel,
    datum: t.datum.toISOString().slice(0, 10),
    uhrzeit: t.uhrzeit,
    beschreibung: t.beschreibung,
    userId: t.userId,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export const terminRepository = {
  async getAll(userId: string): Promise<Termin[]> {
    const termine = await prisma.termin.findMany({
      where: { userId },
      orderBy: { datum: 'asc' },
    });
    return termine.map(serializeTermin);
  },

  async getById(id: string, userId: string): Promise<Termin | null> {
    const termin = await prisma.termin.findFirst({
      where: { id, userId },
    });
    return termin ? serializeTermin(termin) : null;
  },

  async getByDateRange(userId: string, startDate: string, endDate: string): Promise<Termin[]> {
    const termine = await prisma.termin.findMany({
      where: {
        userId,
        datum: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: { datum: 'asc' },
    });
    return termine.map(serializeTermin);
  },

  async create(userId: string, data: TerminCreateInput): Promise<Termin> {
    const termin = await prisma.termin.create({
      data: {
        titel: data.titel,
        datum: new Date(data.datum),
        uhrzeit: data.uhrzeit,
        beschreibung: data.beschreibung ?? null,
        user: { connect: { id: userId } },
      },
    });
    return serializeTermin(termin);
  },

  async update(id: string, userId: string, data: TerminUpdateInput): Promise<Termin | null> {
    const existing = await this.getById(id, userId);
    if (!existing) return null;

    const termin = await prisma.termin.update({
      where: { id },
      data: {
        ...(data.titel !== undefined && { titel: data.titel }),
        ...(data.datum !== undefined && { datum: new Date(data.datum) }),
        ...(data.uhrzeit !== undefined && { uhrzeit: data.uhrzeit }),
        ...(data.beschreibung !== undefined && { beschreibung: data.beschreibung ?? existing.beschreibung }),
      },
    });
    return serializeTermin(termin);
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await prisma.termin.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  },

  /**
   * Termin-Anzahl pro Datum (YYYY-MM-DD) als Record.
   * Aggregation laeuft direkt in der Datenbank (groupBy), statt alle
   * Termine zu laden und im JS zu zaehlen.
   */
  async getStatistik(userId: string): Promise<Record<string, number>> {
    const rows = await prisma.termin.groupBy({
      by: ['datum'],
      where: { userId },
      _count: { _all: true },
    });

    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.datum.toISOString().slice(0, 10)] = row._count._all;
    }
    return counts;
  },
};
