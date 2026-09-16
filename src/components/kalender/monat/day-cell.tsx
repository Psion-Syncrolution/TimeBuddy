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
        w-full h-full min-h-[90px] p-2 rounded-xl border
        transition-all duration-150 cursor-pointer
        hover:shadow-md hover:scale-[1.02] hover:z-10
        ${!day.isCurrentMonth ? 'opacity-40' : ''}
        ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${getTerminBorder(day.termine)}
      `}
      style={bgStyle}
    >
      {/* Oben: Datum */}
      <span className={`text-lg font-bold ${day.termine > 0 ? 'text-gray-900' : 'text-gray-600'}`}>
        {day.date.getDate()}
      </span>

      {/* Unten links: Termin-Count */}
      {day.termine > 0 ? (
        <span className={`
          self-start px-2 py-1 text-xs font-bold rounded-full shadow-sm
          ${day.termine >= 9
            ? 'bg-orange-600 text-white'
            : day.termine >= 5
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-green-500 text-white'
          }
        `}>
          {terminText}
        </span>
      ) : (
        <span className="text-xs text-gray-400 self-start">
          —
        </span>
      )}
    </button>
  );
}
