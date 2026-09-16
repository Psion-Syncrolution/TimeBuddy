import { Button } from '@/components/ui/button';
import { MONATE } from '@/constants/monate';

interface MonthSelectorProps {
  currentMonth: number;
  currentYear: number;
  onPrev: () => void;
  onNext: () => void;
  onToday?: () => void;
}

export function MonthSelector({
  currentMonth,
  currentYear,
  onPrev,
  onNext,
  onToday,
}: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="ghost" size="sm" onClick={onPrev} aria-label="Vorheriger Monat">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      <div className="flex items-center gap-2">
        <h2 className="font-display text-xl font-bold text-ivory min-w-[200px] text-center">
          {MONATE[currentMonth]} {currentYear}
        </h2>
        {onToday && (
          <Button variant="secondary" size="sm" onClick={onToday}>
            Heute
          </Button>
        )}
      </div>

      <Button variant="ghost" size="sm" onClick={onNext} aria-label="Nächster Monat">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
