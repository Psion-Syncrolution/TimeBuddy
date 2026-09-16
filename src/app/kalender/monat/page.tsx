'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCalendar } from '@/hooks/use-calendar';
import { CalendarGrid } from '@/components/kalender/monat/calendar-grid';
import { MonthSelector } from '@/components/kalender/monat/month-selector';
import { Legend } from '@/components/shared/legend';
import { MONATE } from '@/constants/monate';
import { toDateString } from '@/lib/calendar';

export default function MonatPage() {
  const router = useRouter();
  const {
    currentMonth,
    currentYear,
    monthWeeks,
    prevMonth,
    nextMonth,
    goToToday,
    setTerminStatistik,
  } = useCalendar();
  const [loading, setLoading] = useState(true);

  const loadStatistik = useCallback(async () => {
    try {
      const res = await fetch('/api/termine/statistik');
      if (res.ok) {
        const data = await res.json();
        setTerminStatistik(data);
      }
    } catch {
      // Statistik nicht verfügbar
    } finally {
      setLoading(false);
    }
  }, [setTerminStatistik]);

  useEffect(() => {
    loadStatistik();
  }, [loadStatistik]);

  const handleDayClick = (date: Date) => {
    // Verwende toDateString, um das lokale Datum zu erhalten, anstatt UTC
    const dateStr = toDateString(date);
    router.push(`/kalender/tag?datum=${dateStr}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {MONATE[currentMonth]} {currentYear}
        </h1>
        <Legend />
      </div>

      <MonthSelector
        currentMonth={currentMonth}
        currentYear={currentYear}
        onPrev={prevMonth}
        onNext={nextMonth}
        onToday={goToToday}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <CalendarGrid weeks={monthWeeks} onDayClick={handleDayClick} />
        </div>
      )}
    </div>
  );
}
