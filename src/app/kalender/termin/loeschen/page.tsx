'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type { Termin } from '@/types/termin';

function LoeschenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [termin, setTermin] = useState<Termin | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleDelete = async () => {
    if (!terminId) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/termine/${terminId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Löschen fehlgeschlagen');
      router.push('/kalender/monat');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

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
      <h1 className="text-2xl font-bold text-gray-900">Termin löschen</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="max-w-md">
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-medium text-red-800 mb-1">Möchtest du diesen Termin wirklich löschen?</p>
            <p className="text-sm text-red-600">{termin.titel}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="danger" onClick={() => setShowModal(true)} isLoading={deleting}>
              Ja, löschen
            </Button>
            <Button variant="secondary" onClick={() => router.back()}>
              Abbrechen
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Löschen bestätigen"
      >
        <p className="text-sm text-gray-600 mb-4">
          Der Termin &quot;{termin.titel}&quot; wird unwiderruflich gelöscht.
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
            Trotzdem löschen
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function TerminLoeschenPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    }>
      <LoeschenContent />
    </Suspense>
  );
}
