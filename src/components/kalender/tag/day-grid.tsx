import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Termin } from '@/types/termin';

interface DayGridProps {
  date: Date;
  termine: Termin[];
}

export function DayGrid({ date, termine }: DayGridProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayTermine = termine.filter((t) => {
    const tDate = new Date(t.datum);
    return (
      tDate.getDate() === date.getDate() &&
      tDate.getMonth() === date.getMonth() &&
      tDate.getFullYear() === date.getFullYear()
    );
  });

  const getTerminByHour = (hour: number): Termin | undefined => {
    return dayTermine.find((t) => {
      const [h] = t.uhrzeit.split(':').map(Number);
      return h === hour;
    });
  };

  return (
    <div className="space-y-0">
      {hours.map((hour) => {
        const termin = getTerminByHour(hour);
        return (
          <div
            key={hour}
            className={`
              flex gap-4 py-3 border-b border-gray-100
              ${termin ? 'bg-blue-50/50' : ''}
            `}
          >
            <div className="w-16 shrink-0 text-right text-sm text-gray-400 pt-1">
              {format(new Date(2000, 0, 1, hour, 0), 'HH:mm')}
            </div>
            <div className="flex-1 min-h-[48px]">
              {termin ? (
                <div className="p-2 bg-blue-100 border-l-4 border-blue-500 rounded-r-lg">
                  <div className="font-medium text-sm text-gray-900">{termin.titel}</div>
                  <div className="text-xs text-gray-500">{termin.uhrzeit}</div>
                  {termin.beschreibung && (
                    <div className="text-xs text-gray-400 mt-1">{termin.beschreibung}</div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
