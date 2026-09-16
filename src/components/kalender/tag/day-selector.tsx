import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { addDays, subDays } from 'date-fns';

interface DaySelectorProps {
  currentDay: Date;
  onChange: (date: Date) => void;
  onToday?: () => void;
}

export function DaySelector({ currentDay, onChange, onToday }: DaySelectorProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(subDays(currentDay, 1))}
        aria-label="Voriger Tag"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-gray-900 min-w-[240px] text-center">
          {format(currentDay, 'EEEE, dd. MMMM yyyy', { locale: de })}
        </h2>
        {onToday && (
          <Button variant="secondary" size="sm" onClick={onToday}>
            Heute
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(addDays(currentDay, 1))}
        aria-label="Nächster Tag"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
