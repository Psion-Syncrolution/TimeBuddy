export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  termine: number;
}

export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
  startDate: Date;
  endDate: Date;
}
