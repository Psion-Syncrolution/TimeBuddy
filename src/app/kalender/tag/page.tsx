'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DayGrid } from '@/components/kalender/tag/day-grid';
import { DaySelector } from '@/components/kalender/tag/day-selector';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Termin } from '@/types/termin';

// Hilfsfunktion: Parst YYYY-MM-DD korrekt als lokales Datum (ohne Zeitzonen-Shift)
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function TagPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [termine, setTermine] = useState<Termin[]>([]);
  const [loading, setLoading] = useState(true);

  // Lese den Datum-Parameter direkt aus der URL
  const datumParam = searchParams.get('datum');
  // Falls kein Datum in URL, nutze heute, sonst parse korrekt als lokales Datum
  const selectedDate = datumParam ? parseLocalDate(datumParam) : new Date();

  const loadTermine = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/termine');
      if (res.ok) {
        const data = await res.json();
        setTermine(data);
      }
    } catch {
      // Fehler beim Laden
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTermine();
  }, [loadTermine]);

  // Aktualisiert die URL, wenn sich der Tag ändert
  const handleDayChange = (newDate: Date) => {
    const dateStr = format(newDate, 'yyyy-MM-dd');
    router.push(`/kalender/tag?datum=${dateStr}`, { scroll: false });
  };

  const handleToday = () => {
    const today = new Date();
    handleDayChange(today);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Tagesansicht
      </h1>

      <DaySelector
        currentDay={selectedDate}
        onChange={handleDayChange}
        onToday={handleToday}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="mb-4 text-sm text-gray-500">
            {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: de })}
          </div>
          <DayGrid date={selectedDate} termine={termine} />
        </div>
      )}
    </div>
  );
}

export default function TagPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    }>
      <TagPageContent />
    </Suspense>
  );
}
