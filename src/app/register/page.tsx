'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notifyAuthChanged } from '@/lib/auth-event';
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
          <span className="glass inline-flex items-center justify-center w-14 h-14 rounded-full border-gold/30">
            <Clock className="w-7 h-7 text-gold" strokeWidth={1.5} />
          </span>
          <h1 className="font-display text-2xl font-bold text-ivory mt-4">Registrieren</h1>
          <p className="text-sm text-muted mt-1">Erstelle dein TimeBuddy-Konto</p>
        </div>

        {error && (
          <div data-testid="register-error" className="mb-4 p-3 bg-red-950/50 border border-red-500/40 rounded-lg text-sm text-red-300">
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

        <p className="mt-6 text-center text-sm text-muted">
          Bereits registriert?{' '}
          <Link href="/login" className="text-gold hover:text-gold-light font-medium">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
