'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCalendar } from '@/hooks/use-calendar';
import { WeekGrid } from '@/components/kalender/woche/week-grid';
import { WeekSelector } from '@/components/kalender/woche/week-selector';
import { Legend } from '@/components/shared/legend';

export default function WochePage() {
  const {
    weekData,
    prevWeek,
    nextWeek,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Wochenansicht</h1>
        <Legend />
      </div>

      <WeekSelector
        weekNumber={weekData.weekNumber}
        startDate={weekData.startDate}
        endDate={weekData.endDate}
        onPrev={prevWeek}
        onNext={nextWeek}
        onToday={goToToday}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <WeekGrid days={weekData.days} />
        </div>
      )}
    </div>
  );
}
