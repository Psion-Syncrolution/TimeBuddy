'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DayGrid } from '@/components/kalender/tag/day-grid';
import { DaySelector } from '@/components/kalender/tag/day-selector';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { parseLocalDate, toDateString } from '@/lib/calendar';
import type { Termin } from '@/types/termin';

function TagPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [termine, setTermine] = useState<Termin[]>([]);
  // Für welchen Tag (als String) die Termine aktuell geladen sind
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Lese den Datum-Parameter direkt aus der URL
  const datumParam = searchParams.get('datum');
  // Falls kein Datum in URL, nutze heute, sonst parse korrekt als lokales Datum
  const selectedDate = datumParam ? parseLocalDate(datumParam) : new Date();

  // Stabiler String-Wert als Dependency (Date-Objekt wäre bei jedem Render neu)
  const selectedDateStr = toDateString(selectedDate);

  // Lädt nur die Termine des gewählten Tages (statt aller Termine).
  // Alle setState-Aufrufe laufen asynchron nach dem await → kein synchrones
  // setState im Effect (react-hooks/set-state-in-effect).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/termine?start=${selectedDateStr}&end=${selectedDateStr}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setTermine(data);
        }
      } catch {
        // Fehler beim Laden
      } finally {
        if (!cancelled) setLoadedFor(selectedDateStr);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedDateStr]);

  // Abgeleitetes Loading: solange die Daten nicht für den aktuellen Tag geladen sind
  const loading = loadedFor !== selectedDateStr;

  // Aktualisiert die URL, wenn sich der Tag ändert
  const handleDayChange = (newDate: Date) => {
    const dateStr = toDateString(newDate);
    router.push(`/kalender/tag?datum=${dateStr}`, { scroll: false });
  };

  const handleToday = () => {
    const today = new Date();
    handleDayChange(today);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ivory">
        Tagesansicht
      </h1>

      <DaySelector
        currentDay={selectedDate}
        onChange={handleDayChange}
        onToday={handleToday}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-white/10 shadow-lg shadow-black/20 p-4">
          <div className="mb-4 text-sm text-muted">
            {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: de })}
          </div>
          <DayGrid termine={termine} />
        </div>
      )}
    </div>
  );
}

export default function TagPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    }>
      <TagPageContent />
    </Suspense>
  );
}
