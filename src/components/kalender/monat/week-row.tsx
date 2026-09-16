import type { CalendarDay } from '@/types/calendar';
import { DayCell } from './day-cell';

interface WeekRowProps {
  days: CalendarDay[];
  weekNumber?: number | undefined;
  onDayClick?: ((date: Date) => void) | undefined;
}

export function WeekRow({ days, weekNumber, onDayClick }: WeekRowProps) {
  return (
    <div className="grid grid-cols-7 sm:grid-cols-8 gap-1 sm:gap-2">
      {/* KW-Spalte (nur ab sm) */}
      <div className="hidden sm:flex items-center justify-center text-xs text-gold/60 font-medium py-2">
        {weekNumber ? `KW ${weekNumber}` : ''}
      </div>

      {/* Tage */}
      {days.map((day) => (
        <div key={day.date.toISOString()} className="h-full">
          <DayCell day={day} onClick={onDayClick} />
        </div>
      ))}
    </div>
  );
}
