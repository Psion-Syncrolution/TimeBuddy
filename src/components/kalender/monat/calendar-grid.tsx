import { WOCHENTAGE_KURZ } from '@/constants/wochentage';
import type { CalendarWeek } from '@/types/calendar';
import { WeekRow } from './week-row';

interface CalendarGridProps {
  weeks: CalendarWeek[];
  onDayClick?: ((date: Date) => void) | undefined;
}

export function CalendarGrid({ weeks, onDayClick }: CalendarGridProps) {
  return (
    <div className="w-full">
      {/* Wochentage Header */}
      <div className="grid grid-cols-8 gap-2 mb-2">
        <div className="text-center text-xs font-semibold text-gold/70 uppercase py-2 tracking-wider">KW</div>
        {WOCHENTAGE_KURZ.map((tag) => (
          <div
            key={tag}
            className="text-center text-xs font-semibold text-muted uppercase py-2 tracking-wider"
          >
            {tag}
          </div>
        ))}
      </div>

      {/* Wochen */}
      <div className="flex flex-col gap-2">
        {weeks.map((week) => (
          <WeekRow
            key={week.startDate.toISOString()}
            days={week.days}
            weekNumber={week.weekNumber}
            onDayClick={onDayClick}
          />
        ))}
      </div>
    </div>
  );
}
