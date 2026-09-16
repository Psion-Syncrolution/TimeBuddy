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
      <div className="w-full max-w-md p-8 bg-surface/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-gold/20 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-surface-2 border border-gold/30 text-3xl">🕐</span>
          <h1 className="font-display text-2xl font-bold text-ivory mt-4">Anmelden</h1>
          <p className="text-sm text-muted mt-1">Willkommen zurück bei TimeBuddy</p>
        </div>

        {error && (
          <div data-testid="login-error" className="mb-4 p-3 bg-red-950/50 border border-red-500/40 rounded-lg text-sm text-red-300">
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

        <p className="mt-6 text-center text-sm text-muted">
          Noch kein Konto?{' '}
          <Link href="/register" className="text-gold hover:text-gold-light font-medium">
            Registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
