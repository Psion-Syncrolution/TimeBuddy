'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ErinnerungForm } from '@/components/erinnerungen/erinnerung-form';
import { ErinnerungList } from '@/components/erinnerungen/erinnerung-list';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type { Erinnerung } from '@/types/erinnerung';

function ErinnerungPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [erinnerungen, setErinnerungen] = useState<Erinnerung[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingErinnerung, setEditingErinnerung] = useState<Erinnerung | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadErinnerungen();
  }, []);

  // Check for URL params
  useEffect(() => {
    const bearbeiten = searchParams.get('bearbeiten');
    const loeschen = searchParams.get('loeschen');

    if (bearbeiten && erinnerungen.length > 0) {
      const erinnerung = erinnerungen.find((e) => e.id === bearbeiten);
      if (erinnerung) {
        setEditingErinnerung(erinnerung);
        setShowForm(true);
      }
    }

    if (loeschen) {
      setDeletingId(loeschen);
      setShowDeleteModal(true);
    }
  }, [searchParams, erinnerungen]);

  const loadErinnerungen = async () => {
    try {
      const res = await fetch('/api/erinnerungen');
      if (res.ok) {
        const data = await res.json();
        setErinnerungen(data);
      }
    } catch {
      setError('Fehler beim Laden der Erinnerungen');
    } finally {
      setLoading(false);
    }
  };

  // Nach erfolgreichem Speichern: Formular schliessen, Liste aktualisieren,
  // URL-Parameter (bearbeiten/loeschen) entfernen.
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingErinnerung(null);
    loadErinnerungen();
    if (searchParams.toString()) {
      router.replace('/kalender/erinnerung', { scroll: false });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/erinnerungen/${deletingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Löschen fehlgeschlagen');
      setErinnerungen((prev) => prev.filter((e) => e.id !== deletingId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Erinnerungen</h1>
        <Button onClick={() => { setShowForm(true); setEditingErinnerung(null); }}>
          Neue Erinnerung
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setEditingErinnerung(null);
                if (searchParams.toString()) {
                  router.replace('/kalender/erinnerung', { scroll: false });
                }
              }}
            >
              ← Zurück zur Übersicht
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingErinnerung ? 'Erinnerung bearbeiten' : 'Neue Erinnerung erstellen'}
          </h2>
          <ErinnerungForm
            initialData={editingErinnerung || undefined}
            mode={editingErinnerung ? 'edit' : 'create'}
            onSuccess={handleFormSuccess}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <ErinnerungList erinnerungen={erinnerungen} loading={loading} />
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeletingId(null); }}
        title="Erinnerung löschen"
      >
        <p className="text-sm text-gray-600 mb-4">
          Möchtest du diese Erinnerung wirklich unwiderruflich löschen?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setDeletingId(null); }}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
            Löschen
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function ErinnerungPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    }>
      <ErinnerungPageContent />
    </Suspense>
  );
}
