import { useMemo } from 'react';
import { format } from 'date-fns';
import type { Termin } from '@/types/termin';

interface DayGridProps {
  /** Termine des anzuzeigenden Tages (werden serverseitig gefiltert). */
  termine: Termin[];
}

export function DayGrid({ termine }: DayGridProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Termine einmalig nach Stunde gruppieren (statt 24x find() pro Render).
  // Mehrere Termine zur selben Stunde werden alle angezeigt.
  const termineByHour = useMemo(() => {
    const map = new Map<number, Termin[]>();
    for (const termin of termine) {
      const hour = Number(termin.uhrzeit.split(':')[0]);
      const list = map.get(hour);
      if (list) {
        list.push(termin);
      } else {
        map.set(hour, [termin]);
      }
    }
    return map;
  }, [termine]);

  return (
    <div className="space-y-0">
      {hours.map((hour) => {
        const hourTermine = termineByHour.get(hour);
        return (
          <div
            key={hour}
            className={`
              flex gap-4 py-3 border-b border-white/5
              ${hourTermine ? 'bg-gold/5' : ''}
            `}
          >
            <div className="w-16 shrink-0 text-right text-sm text-muted/70 pt-1 font-mono">
              {format(new Date(2000, 0, 1, hour, 0), 'HH:mm')}
            </div>
            <div className="flex-1 min-h-[48px] space-y-2">
              {hourTermine?.map((termin) => (
                <div key={termin.id} className="p-3 bg-surface-2 border-l-2 border-gold/70 rounded-r-lg shadow-md shadow-black/20 hover:border-gold transition-colors">
                  <div className="font-medium text-sm text-ivory">{termin.titel}</div>
                  <div className="text-xs text-gold/80 font-mono">{termin.uhrzeit}</div>
                  {termin.beschreibung && (
                    <div className="text-xs text-muted mt-1">{termin.beschreibung}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
