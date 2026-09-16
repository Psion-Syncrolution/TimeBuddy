'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  getMonthDays,
  getWeekRange,
  navigateMonth,
  navigateWeek,
  toDateString,
  getWeekNumber,
} from '@/lib/calendar';
import type { CalendarDay, CalendarWeek } from '@/types/calendar';

export function useCalendar() {
  // Stabiles "Heute" (einmal pro Mount) – verhindert, dass useMemo-Deps
  // bei jedem Render neu sind.
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentWeekDate, setCurrentWeekDate] = useState(today);
  const [terminCounts, setTerminCounts] = useState<Record<string, number>>({});

  const monthWeeks = useMemo(() => {
    const days = getMonthDays(currentYear, currentMonth).map((day) => {
      const dateStr = toDateString(day.date);
      return {
        ...day,
        termine: terminCounts[dateStr] || 0,
      } as CalendarDay;
    });

    const weeks: CalendarWeek[] = [];
    for (let i = 0; i < days.length; i += 7) {
      const weekDays = days.slice(i, i + 7);
      if (weekDays.length > 0) {
        weeks.push({
          weekNumber: getWeekNumber(weekDays[0].date),
          days: weekDays,
          startDate: weekDays[0].date,
          endDate: weekDays[weekDays.length - 1].date,
        });
      }
    }
    return weeks;
  }, [currentYear, currentMonth, terminCounts]);

  const weekData = useMemo(() => {
    const range = getWeekRange(currentWeekDate);
    const days = range.days.map((date) => {
      const dateStr = toDateString(date);
      return {
        date,
        isCurrentMonth: date.getMonth() === today.getMonth(),
        termine: terminCounts[dateStr] || 0,
      } as CalendarDay;
    });

    return {
      weekNumber: range.weekNumber,
      days,
      startDate: range.start,
      endDate: range.end,
    };
  }, [currentWeekDate, terminCounts, today]);

  const prevMonth = useCallback(() => {
    const { year, month } = navigateMonth(currentYear, currentMonth, 'prev');
    setCurrentYear(year);
    setCurrentMonth(month);
  }, [currentYear, currentMonth, setCurrentYear, setCurrentMonth]);

  const nextMonth = useCallback(() => {
    const { year, month } = navigateMonth(currentYear, currentMonth, 'next');
    setCurrentYear(year);
    setCurrentMonth(month);
  }, [currentYear, currentMonth, setCurrentYear, setCurrentMonth]);

  const prevWeek = useCallback(() => {
    setCurrentWeekDate((prev) => navigateWeek(prev, 'prev'));
  }, []);

  const nextWeek = useCallback(() => {
    setCurrentWeekDate((prev) => navigateWeek(prev, 'next'));
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setCurrentWeekDate(now);
  }, [setCurrentMonth, setCurrentYear, setCurrentWeekDate]);

  const setTerminStatistik = useCallback((statistik: Record<string, number>) => {
    setTerminCounts(statistik);
  }, []);

  return {
    currentMonth,
    currentYear,
    currentWeekDate,
    monthWeeks,
    weekData,
    prevMonth,
    nextMonth,
    prevWeek,
    nextWeek,
    goToToday,
    setTerminStatistik,
  };
}
