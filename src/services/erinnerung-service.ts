import type { Erinnerung, ErinnerungCreateInput, ErinnerungUpdateInput } from '@/types/erinnerung';

const API_BASE = '/api/erinnerungen';

export const erinnerungService = {
  async getAll(): Promise<Erinnerung[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Fehler beim Laden der Erinnerungen');
    return res.json();
  },

  async getById(id: string): Promise<Erinnerung> {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error('Erinnerung nicht gefunden');
    return res.json();
  },

  async create(data: ErinnerungCreateInput): Promise<Erinnerung> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Fehler beim Erstellen');
    return res.json();
  },

  async update(id: string, data: ErinnerungUpdateInput): Promise<Erinnerung> {
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
};
