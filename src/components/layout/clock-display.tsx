'use client';

import { useSyncExternalStore } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Kleiner "Clock-Store" für useSyncExternalStore: liefert die aktuelle Zeit
// und benachrichtigt Subscriber einmal pro Sekunde. Der Timer läuft nur,
// solange mindestens ein Subscriber aktiv ist.
let snapshot = new Date();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    timer = setInterval(() => {
      snapshot = new Date();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  return snapshot;
}

// Fester Server-Snapshot (null), damit SSR und Hydration ohne Mismatch auskommen.
function getServerSnapshot(): Date | null {
  return null;
}

export function ClockDisplay() {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!now) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl font-mono font-bold text-muted/60 tracking-wider">
          --:--:--
        </div>
        <div className="mt-2 text-lg text-muted">Lädt...</div>
      </div>
    );
  }

  const time = format(now, 'HH:mm:ss');
  const date = format(now, 'EEEE, dd. MMMM yyyy', { locale: de });

  return (
    <div className="text-center py-4">
      <div className="text-5xl font-mono font-bold text-ivory tracking-wider [text-shadow:0_0_24px_rgba(201,169,97,0.35)]">
        {time}
      </div>
      <div className="mt-2 text-lg text-gold/80 font-medium">
        {date}
      </div>
    </div>
  );
}
