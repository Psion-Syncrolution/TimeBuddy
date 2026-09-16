'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Termin, TerminCreateInput, TerminUpdateInput } from '@/types/termin';
import { terminService } from '@/services/termin-service';

export function useTermine() {
  const [termine, setTermine] = useState<Termin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTermine = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await terminService.getAll();
      setTermine(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTermine();
  }, [loadTermine]);

  const createTermin = async (data: TerminCreateInput) => {
    const newTermin = await terminService.create(data);
    setTermine((prev) => [...prev, newTermin]);
    return newTermin;
  };

  const updateTermin = async (id: string, data: TerminUpdateInput) => {
    const updated = await terminService.update(id, data);
    setTermine((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTermin = async (id: string) => {
    await terminService.delete(id);
    setTermine((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    termine,
    loading,
    error,
    createTermin,
    updateTermin,
    deleteTermin,
    refresh: loadTermine,
  };
}
