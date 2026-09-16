'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Erinnerung, ErinnerungCreateInput, ErinnerungUpdateInput } from '@/types/erinnerung';
import { erinnerungService } from '@/services/erinnerung-service';

export function useErinnerungen() {
  const [erinnerungen, setErinnerungen] = useState<Erinnerung[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadErinnerungen = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await erinnerungService.getAll();
      setErinnerungen(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadErinnerungen();
  }, [loadErinnerungen]);

  const createErinnerung = async (data: ErinnerungCreateInput) => {
    const newErinnerung = await erinnerungService.create(data);
    setErinnerungen((prev) => [...prev, newErinnerung]);
    return newErinnerung;
  };

  const updateErinnerung = async (id: string, data: ErinnerungUpdateInput) => {
    const updated = await erinnerungService.update(id, data);
    setErinnerungen((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteErinnerung = async (id: string) => {
    await erinnerungService.delete(id);
    setErinnerungen((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    erinnerungen,
    loading,
    error,
    createErinnerung,
    updateErinnerung,
    deleteErinnerung,
    refresh: loadErinnerungen,
  };
}
