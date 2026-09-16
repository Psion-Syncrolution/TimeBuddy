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
    if (!terminId) {
      setError('Keine Termin-ID angegeben');
      setLoading(false);
      return;
    }

    fetch(`/api/termine/${terminId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Termin nicht gefunden');
        return res.json();
      })
      .then((data) => {
        setTermin(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [terminId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !termin) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
        {error || 'Termin nicht gefunden'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Termin bearbeiten</h1>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <TerminForm initialData={termin} mode="edit" />
      </div>
    </div>
  );
}

export default function TerminBearbeitenPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    }>
      <BearbeitenContent />
    </Suspense>
  );
}
