import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface WeekSelectorProps {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday?: () => void;
}

export function WeekSelector({
  weekNumber,
  startDate,
  endDate,
  onPrev,
  onNext,
  onToday,
}: WeekSelectorProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="ghost" size="sm" onClick={onPrev} aria-label="Vorherige Woche">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-gray-900 min-w-[280px] text-center">
          KW {weekNumber}
          <span className="block text-sm font-normal text-gray-500">
            {format(startDate, 'dd.MM.')} – {format(endDate, 'dd.MM.yyyy')}
          </span>
        </h2>
        {onToday && (
          <Button variant="secondary" size="sm" onClick={onToday}>
            Heute
          </Button>
        )}
      </div>

      <Button variant="ghost" size="sm" onClick={onNext} aria-label="Nächste Woche">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
