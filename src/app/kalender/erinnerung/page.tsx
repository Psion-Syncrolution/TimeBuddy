'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL-Parameter als Single Source of Truth für Bearbeiten/Löschen –
  // dadurch kein synchrones setState im Effect (react-hooks/set-state-in-effect).
  const bearbeitenParam = searchParams.get('bearbeiten');
  const loeschenParam = searchParams.get('loeschen');

  const editingErinnerung = useMemo(
    () => (bearbeitenParam ? erinnerungen.find((e) => e.id === bearbeitenParam) ?? null : null),
    [erinnerungen, bearbeitenParam]
  );

  // Formular ist offen, wenn über die URL bearbeitet wird (nach dem Laden) oder manuell erstellt
  const showForm = showCreateForm || (!!bearbeitenParam && !loading && !!editingErinnerung);

  // Reine Datenladung ohne setState – wird im Effect und in Event-Handler genutzt.
  const fetchErinnerungen = async (): Promise<Erinnerung[]> => {
    const res = await fetch('/api/erinnerungen');
    if (!res.ok) throw new Error('Fehler beim Laden der Erinnerungen');
    return (await res.json()) as Erinnerung[];
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchErinnerungen();
        if (!cancelled) setErinnerungen(data);
      } catch {
        if (!cancelled) setError('Fehler beim Laden der Erinnerungen');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // URL-Parameter entfernen – Formular/Modal schliessen sich dadurch automatisch.
  const clearUrlParams = () => {
    if (searchParams.toString()) {
      router.replace('/kalender/erinnerung', { scroll: false });
    }
  };

  // Nach erfolgreichem Speichern: manuelles Formular schliessen, Liste aktualisieren,
  // URL-Parameter (bearbeiten) entfernen.
  const handleFormSuccess = async () => {
    setShowCreateForm(false);
    clearUrlParams();
    try {
      const data = await fetchErinnerungen();
      setErinnerungen(data);
    } catch {
      setError('Fehler beim Laden der Erinnerungen');
    }
  };

  const handleDelete = async () => {
    if (!loeschenParam) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/erinnerungen/${loeschenParam}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Löschen fehlgeschlagen');
      setErinnerungen((prev) => prev.filter((e) => e.id !== loeschenParam));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setDeleting(false);
      clearUrlParams();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Erinnerungen</h1>
        <Button onClick={() => { setShowCreateForm(true); clearUrlParams(); }}>
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
                setShowCreateForm(false);
                clearUrlParams();
              }}
            >
              ← Zurück zur Übersicht
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingErinnerung ? 'Erinnerung bearbeiten' : 'Neue Erinnerung erstellen'}
          </h2>
          <ErinnerungForm
            initialData={editingErinnerung ?? undefined}
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
        isOpen={!!loeschenParam}
        onClose={clearUrlParams}
        title="Erinnerung löschen"
      >
        <p className="text-sm text-gray-600 mb-4">
          Möchtest du diese Erinnerung wirklich unwiderruflich löschen?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={clearUrlParams}>
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
