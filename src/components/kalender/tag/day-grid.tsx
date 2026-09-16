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
              flex gap-4 py-3 border-b border-gray-100
              ${hourTermine ? 'bg-blue-50/50' : ''}
            `}
          >
            <div className="w-16 shrink-0 text-right text-sm text-gray-400 pt-1">
              {format(new Date(2000, 0, 1, hour, 0), 'HH:mm')}
            </div>
            <div className="flex-1 min-h-[48px] space-y-2">
              {hourTermine?.map((termin) => (
                <div key={termin.id} className="p-2 bg-blue-100 border-l-4 border-blue-500 rounded-r-lg">
                  <div className="font-medium text-sm text-gray-900">{termin.titel}</div>
                  <div className="text-xs text-gray-500">{termin.uhrzeit}</div>
                  {termin.beschreibung && (
                    <div className="text-xs text-gray-400 mt-1">{termin.beschreibung}</div>
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
