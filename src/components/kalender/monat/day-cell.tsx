import type { CalendarDay } from '@/types/calendar';
import { getTerminHintergrund, getTerminBorder } from '@/lib/colors';

interface DayCellProps {
  day: CalendarDay;
  onClick?: ((date: Date) => void) | undefined;
}

export function DayCell({ day, onClick }: DayCellProps) {
  const isToday =
    day.date.getDate() === new Date().getDate() &&
    day.date.getMonth() === new Date().getMonth() &&
    day.date.getFullYear() === new Date().getFullYear();

  const bgStyle = day.termine > 0
    ? { backgroundColor: getTerminHintergrund(day.termine) }
    : {};

  // Pluralisierung: "Termin" vs "Termine"
  const terminText = day.termine > 0
    ? day.termine === 1
      ? 'Termin: 1'
      : `Termine: ${day.termine}`
    : '';

  return (
    <button
      onClick={() => onClick?.(day.date)}
      className={`
        relative flex flex-col items-center justify-between
        w-full h-full min-h-[90px] p-2 rounded-xl border bg-surface
        transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:shadow-black/30 hover:border-gold/40 hover:scale-[1.02] hover:z-10
        ${!day.isCurrentMonth ? 'opacity-40' : ''}
        ${isToday ? 'ring-2 ring-gold ring-offset-2 ring-offset-background animate-glow-pulse' : ''}
        ${getTerminBorder(day.termine)}
      `}
      style={bgStyle}
    >
      {/* Oben: Datum */}
      <span className={`text-lg font-bold ${day.termine > 0 ? 'text-ivory' : 'text-muted'}`}>
        {day.date.getDate()}
      </span>

      {/* Unten links: Termin-Count */}
      {day.termine > 0 ? (
        <span className={`
          self-start px-2 py-1 text-xs font-bold rounded-full shadow-sm border
          ${day.termine >= 9
            ? 'bg-red-500/20 text-red-300 border-red-500/40'
            : day.termine >= 5
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }
        `}>
          {terminText}
        </span>
      ) : (
        <span className="text-xs text-muted/50 self-start">
          —
        </span>
      )}
    </button>
  );
}
