'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TerminSchema } from '@/validators/termin-schema';
import type { Termin, TerminCreateInput, TerminUpdateInput } from '@/types/termin';

interface TerminFormProps {
  initialData?: Termin;
  mode?: 'create' | 'edit';
}

export function TerminForm({ initialData, mode = 'create' }: TerminFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titel: initialData?.titel || '',
    datum: initialData?.datum?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    uhrzeit: initialData?.uhrzeit || '09:00',
    beschreibung: initialData?.beschreibung || '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = TerminSchema.safeParse(formData);
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
        ? `/api/termine/${initialData.id}`
        : '/api/termine';
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

      router.push('/kalender/monat');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <Input
        id="titel"
        label="Titel *"
        value={formData.titel}
        onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
        error={fieldErrors.titel}
        placeholder="Termin-Titel"
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
        error={fieldErrors.beschreibung}
        placeholder="Optionale Beschreibung"
        showCharCount
        maxLength={1000}
        rows={4}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={loading}>
          {mode === 'edit' ? 'Aktualisieren' : 'Termin erstellen'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Abbrechen
        </Button>
      </div>
    </form>
  );
}
