'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  getMonthDays,
  getWeekRange,
  navigateMonth,
  navigateWeek,
  toDateString,
  getTerminFarbe,
} from '@/lib/calendar';
import type { CalendarDay, CalendarWeek } from '@/types/calendar';

export function useCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentWeekDate, setCurrentWeekDate] = useState(today);
  const [currentDay, setCurrentDay] = useState(today);
  const [terminCounts, setTerminCounts] = useState<Record<string, number>>({});

  const monthDays = useMemo(() => {
    const days = getMonthDays(currentYear, currentMonth);
    return days.map((day) => {
      const dateStr = toDateString(day.date);
      const count = terminCounts[dateStr] || 0;
      return {
        ...day,
        termine: count,
        colorClass: getTerminFarbe(count),
      } as CalendarDay;
    });
  }, [currentYear, currentMonth, terminCounts]);

  const monthWeeks = useMemo(() => {
    const weeks: CalendarWeek[] = [];
    const dayList = monthDays as CalendarDay[];
    for (let i = 0; i < dayList.length; i += 7) {
      const weekDays = dayList.slice(i, i + 7);
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
  }, [monthDays]);

  const weekData = useMemo(() => {
    const range = getWeekRange(currentWeekDate);
    const days = range.days.map((date) => {
      const dateStr = toDateString(date);
      const count = terminCounts[dateStr] || 0;
      return {
        date,
        isCurrentMonth: date.getMonth() === today.getMonth(),
        termine: count,
        colorClass: getTerminFarbe(count),
      } as CalendarDay;
    });

    return {
      weekNumber: range.weekNumber,
      days,
      startDate: range.start,
      endDate: range.end,
    };
  }, [currentWeekDate, terminCounts, today]);

  function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  const prevMonth = useCallback(() => {
    const { year, month } = navigateMonth(currentYear, currentMonth, 'prev');
    setCurrentYear(year);
    setCurrentMonth(month);
  }, [currentYear, currentMonth]);

  const nextMonth = useCallback(() => {
    const { year, month } = navigateMonth(currentYear, currentMonth, 'next');
    setCurrentYear(year);
    setCurrentMonth(month);
  }, [currentYear, currentMonth]);

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
    setCurrentDay(now);
  }, []);

  const setTerminStatistik = useCallback((statistik: Record<string, number>) => {
    setTerminCounts(statistik);
  }, []);

  return {
    currentMonth,
    currentYear,
    currentWeekDate,
    currentDay,
    setCurrentDay,
    monthDays,
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
