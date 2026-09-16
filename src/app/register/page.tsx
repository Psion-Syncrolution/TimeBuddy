'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RegisterSchema } from '@/validators/auth-schema';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = RegisterSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? 'form');
        errors[key] = issue.message;
      });
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen');
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
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <span className="text-4xl">🕐</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Registrieren</h1>
          <p className="text-sm text-gray-500 mt-1">Erstelle dein TimeBuddy-Konto</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="E-Mail"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={fieldErrors.email}
            placeholder="deine@email.de"
            required
          />

          <Input
            id="password"
            label="Passwort"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={fieldErrors.password}
            placeholder="Mindestens 8 Zeichen"
            required
          />

          <Input
            id="confirmPassword"
            label="Passwort bestätigen"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={fieldErrors.confirmPassword}
            placeholder="Passwort wiederholen"
            required
          />

          <Button type="submit" className="w-full" isLoading={loading}>
            Registrieren
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Bereits registriert?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
