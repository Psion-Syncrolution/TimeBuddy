import Link from 'next/link';
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
              flex items-center gap-4 p-3 rounded-xl border bg-surface
              transition-all duration-200 hover:shadow-lg hover:shadow-black/30 hover:border-gold/40
              ${isToday ? 'ring-2 ring-gold ring-offset-1 ring-offset-background' : ''}
              ${getTerminBorder(day.termine)}
            `}
            style={bgStyle}
          >
            <div className="w-24 shrink-0">
              <div className={`text-sm font-semibold ${getTerminTextColor(day.termine)}`}>
                {WOCHENTAGE[dayIndex]}
              </div>
              <div className="text-xs text-muted">
                {day.date.getDate()}.{String(day.date.getMonth() + 1).padStart(2, '0')}.{day.date.getFullYear()}
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              {day.termine > 0 ? (
                <span className={`
                  px-2 py-1 rounded-full text-xs font-bold border
                  ${day.termine >= 9
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : day.termine >= 5
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }
                `}>
                  {day.termine} Termin{day.termine > 1 ? 'e' : ''}
                </span>
              ) : (
                <span className="text-sm text-muted/60">Keine Termine</span>
              )}
            </div>

            <svg className="w-5 h-5 text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
