'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TerminForm } from '@/components/termine/termin-form';
import type { Termin } from '@/types/termin';

function BearbeitenContent() {
  const searchParams = useSearchParams();
  const [termin, setTermin] = useState<Termin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const terminId = searchParams.get('id');

  useEffect(() => {
    if (!terminId) return; // Fehlende ID wird beim Render abgeleitet (siehe unten)
    let cancelled = false;

    fetch(`/api/termine/${terminId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Termin nicht gefunden');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setTermin(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [terminId]);

  // Fehlende ID wird abgeleitet statt per setState im Effect gesetzt
  if (!terminId) {
    return (
      <div className="p-4 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300">
        Keine Termin-ID angegeben
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !termin) {
    return (
      <div className="p-4 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300">
        {error || 'Termin nicht gefunden'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ivory">Termin bearbeiten</h1>
      <div className="bg-surface rounded-2xl border border-white/10 shadow-lg shadow-black/20 p-6">
        <TerminForm initialData={termin} mode="edit" />
      </div>
    </div>
  );
}

export default function TerminBearbeitenPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    }>
      <BearbeitenContent />
    </Suspense>
  );
}
