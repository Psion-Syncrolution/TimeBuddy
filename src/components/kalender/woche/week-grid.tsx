import Link from 'next/link';
import { de } from 'date-fns/locale';
import { WOCHENTAGE } from '@/constants/wochentage';
import { toDateString } from '@/lib/calendar';
import type { CalendarDay } from '@/types/calendar';
import { getTerminHintergrund, getTerminBorder, getTerminTextColor } from '@/lib/colors';

interface WeekGridProps {
  days: CalendarDay[];
}

export function WeekGrid({ days }: WeekGridProps) {
  const getDayIndex = (date: Date): number => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  return (
    <div className="space-y-2">
      {days.map((day) => {
        const dayIndex = getDayIndex(day.date);
        const isToday =
          day.date.getDate() === new Date().getDate() &&
          day.date.getMonth() === new Date().getMonth() &&
          day.date.getFullYear() === new Date().getFullYear();

        const bgStyle = day.termine > 0
          ? { backgroundColor: getTerminHintergrund(day.termine) }
          : {};

        // Verwende toDateString, um das lokale Datum zu erhalten
        const dateStr = toDateString(day.date);

        return (
          <Link
            key={day.date.toISOString()}
            href={`/kalender/tag?datum=${dateStr}`}
            className={`
              flex items-center gap-4 p-3 rounded-xl border
              transition-all duration-150 hover:shadow-md
              ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
              ${getTerminBorder(day.termine)}
            `}
            style={bgStyle}
          >
            <div className="w-24 shrink-0">
              <div className={`text-sm font-semibold ${getTerminTextColor(day.termine)}`}>
                {WOCHENTAGE[dayIndex]}
              </div>
              <div className="text-xs text-gray-500">
                {day.date.getDate()}.{String(day.date.getMonth() + 1).padStart(2, '0')}.{day.date.getFullYear()}
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              {day.termine > 0 ? (
                <span className={`
                  px-2 py-1 rounded-full text-xs font-bold
                  ${day.termine >= 9
                    ? 'bg-orange-600 text-white'
                    : day.termine >= 5
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-green-500 text-white'
                  }
                `}>
                  {day.termine} Termin{day.termine > 1 ? 'e' : ''}
                </span>
              ) : (
                <span className="text-sm text-gray-400">Keine Termine</span>
              )}
            </div>

            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
