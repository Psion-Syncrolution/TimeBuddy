'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notifyAuthChanged } from '@/lib/auth-event';
import { LoginSchema } from '@/validators/auth-schema';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = LoginSchema.safeParse(formData);
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login fehlgeschlagen');
      }

      notifyAuthChanged();
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
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Anmelden</h1>
          <p className="text-sm text-gray-500 mt-1">Willkommen zurück bei TimeBuddy</p>
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
            placeholder="••••••••"
            required
          />

          <Button type="submit" className="w-full" isLoading={loading}>
            Anmelden
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Noch kein Konto?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
