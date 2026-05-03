import { parseCalendarDateInput } from './patientNotesMoodAggregation';

export function parseCalendarDateInputOrToday(calendarDateInput: string): {
  calendarYear: number;
  calendarMonthIndex: number;
  dayOfMonth: number;
} {
  try {
    const parsed = parseCalendarDateInput(calendarDateInput);
    const probe = new Date(parsed.calendarYear, parsed.calendarMonthIndex, parsed.dayOfMonth);

    if (
      Number.isNaN(probe.getTime()) ||
      probe.getFullYear() !== parsed.calendarYear ||
      probe.getMonth() !== parsed.calendarMonthIndex ||
      probe.getDate() !== parsed.dayOfMonth
    ) {
      throw new Error('invalid calendar date');
    }

    return parsed;
  } catch {
    const today = new Date();

    return {
      calendarYear: today.getFullYear(),
      calendarMonthIndex: today.getMonth(),
      dayOfMonth: today.getDate(),
    };
  }
}
