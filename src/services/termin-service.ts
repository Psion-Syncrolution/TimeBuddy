import type { Termin, TerminCreateInput, TerminUpdateInput } from '@/types/termin';

const API_BASE = '/api/termine';

export const terminService = {
  async getAll(): Promise<Termin[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Fehler beim Laden der Termine');
    return res.json();
  },

  async getById(id: string): Promise<Termin> {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Termin nicht gefunden');
    return res.json();
  },

  async create(data: TerminCreateInput): Promise<Termin> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Fehler beim Erstellen');
    return res.json();
  },

  async update(id: string, data: TerminUpdateInput): Promise<Termin> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Fehler beim Aktualisieren');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Fehler beim Löschen');
  },

  async getStatistik(): Promise<Record<string, number>> {
    const res = await fetch(`${API_BASE}/statistik`);
    if (!res.ok) throw new Error('Fehler beim Laden der Statistik');
    return res.json();
  },
};
