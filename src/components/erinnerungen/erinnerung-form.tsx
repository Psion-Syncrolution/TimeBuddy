'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TerminDropdown } from '@/components/termine/termin-dropdown';
import { ErinnerungSchema } from '@/validators/erinnerung-schema';
import type { Termin } from '@/types/termin';
import type { Erinnerung } from '@/types/erinnerung';

interface ErinnerungFormProps {
  initialData?: Erinnerung | undefined;
  mode?: 'create' | 'edit';
  /** Wird nach erfolgreichem Speichern aufgerufen (z. B. um das Formular zu schliessen und die Liste neu zu laden). */
  onSuccess?: () => void;
}

export function ErinnerungForm({ initialData, mode = 'create', onSuccess }: ErinnerungFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termine, setTermine] = useState<Termin[]>([]);
  const [formData, setFormData] = useState({
    terminId: initialData?.terminId || '',
    erinnerung: initialData?.erinnerung || '',
    datum: initialData?.datum?.slice(0, 10) || '',
    uhrzeit: initialData?.uhrzeit || '09:00',
    beschreibung: initialData?.beschreibung || '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/termine')
      .then((res) => res.json())
      .then((data) => setTermine(data))
      .catch(() => setError('Fehler beim Laden der Termine'));
  }, []);

  const validate = () => {
    const result = ErinnerungSchema.safeParse(formData);
    if (result.success) {
      setFieldErrors({});
      return true;
    }
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = String(issue.path[0] ?? 'form');
      errors[key] = issue.message;
    });
    setFieldErrors(errors);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const url = mode === 'edit' && initialData
        ? `/api/erinnerungen/${initialData.id}`
        : '/api/erinnerungen';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fehler beim Speichern');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/kalender/erinnerung');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminChange = (terminId: string) => {
    const termin = termine.find((t) => t.id === terminId);
    if (termin) {
      setFormData((prev) => ({
        ...prev,
        terminId,
        datum: termin.datum.slice(0, 10),
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <TerminDropdown
        termine={termine}
        value={formData.terminId}
        onChange={handleTerminChange}
        error={fieldErrors.terminId}
      />

      <Input
        id="erinnerung"
        label="Erinnerung *"
        value={formData.erinnerung}
        onChange={(e) => setFormData({ ...formData, erinnerung: e.target.value })}
        error={fieldErrors.erinnerung}
        placeholder="Woran sollen wir dich erinnern?"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="datum"
          label="Datum *"
          type="date"
          value={formData.datum}
          onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
          error={fieldErrors.datum}
          required
        />

        <Input
          id="uhrzeit"
          label="Uhrzeit *"
          type="time"
          value={formData.uhrzeit}
          onChange={(e) => setFormData({ ...formData, uhrzeit: e.target.value })}
          error={fieldErrors.uhrzeit}
          required
        />
      </div>

      <Textarea
        id="beschreibung"
        label="Beschreibung"
        value={formData.beschreibung}
        onChange={(e) => setFormData({ ...formData, beschreibung: e.target.value })}
        placeholder="Optionale Beschreibung"
        showCharCount
        maxLength={1000}
        rows={3}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={loading}>
          {mode === 'edit' ? 'Aktualisieren' : 'Erinnerung erstellen'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Abbrechen
        </Button>
      </div>
    </form>
  );
}
