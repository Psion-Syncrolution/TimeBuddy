export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  termine: number;
  colorClass: string;
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
  startDate: Date;
  endDate: Date;
}

export interface CalendarMonth {
  month: number;
  year: number;
  weeks: CalendarWeek[];
}

export interface StatistikDatum {
  datum: string;
  count: number;
}
