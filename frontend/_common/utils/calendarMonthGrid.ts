export const calendarWeekdayLabelsShortEnglish = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const;

export function shiftCalendarMonth(
  calendarYear: number,
  calendarMonthIndex: number,
  monthDelta: number,
): { calendarYear: number; calendarMonthIndex: number } {
  const shiftedDate = new Date(calendarYear, calendarMonthIndex + monthDelta, 1);

  return {
    calendarYear: shiftedDate.getFullYear(),
    calendarMonthIndex: shiftedDate.getMonth(),
  };
}

export function buildCalendarMonthDayCells(
  calendarYear: number,
  calendarMonthIndex: number,
): Array<number | null> {
  const firstDayOfMonth = new Date(calendarYear, calendarMonthIndex, 1);
  const lastDayOfMonth = new Date(calendarYear, calendarMonthIndex + 1, 0);
  const dayCountInMonth = lastDayOfMonth.getDate();
  const leadingEmptyCellCount = firstDayOfMonth.getDay();

  const dayCells: Array<number | null> = [];

  for (let paddingIndex = 0; paddingIndex < leadingEmptyCellCount; paddingIndex++) {
    dayCells.push(null);
  }

  for (let dayOfMonth = 1; dayOfMonth <= dayCountInMonth; dayOfMonth++) {
    dayCells.push(dayOfMonth);
  }

  while (dayCells.length % 7 !== 0) {
    dayCells.push(null);
  }

  const minimumRowCount = 6;
  while (dayCells.length < minimumRowCount * 7) {
    dayCells.push(null);
  }

  return dayCells;
}

export function isCalendarLocalToday(
  calendarYear: number,
  calendarMonthIndex: number,
  dayOfMonth: number,
): boolean {
  const today = new Date();

  return (
    today.getFullYear() === calendarYear &&
    today.getMonth() === calendarMonthIndex &&
    today.getDate() === dayOfMonth
  );
}
