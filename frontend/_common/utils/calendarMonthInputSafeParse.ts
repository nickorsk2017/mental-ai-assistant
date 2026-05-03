export function parseCalendarMonthInput(calendarMonthInput: string): {
  calendarYear: number;
  calendarMonthIndex: number;
} {
  const [yearSegment, monthSegment] = calendarMonthInput.split('-');

  return {
    calendarYear: Number(yearSegment),
    calendarMonthIndex: Number(monthSegment) - 1,
  };
}

export function parseCalendarMonthInputOrThisMonth(calendarMonthInput: string): {
  calendarYear: number;
  calendarMonthIndex: number;
} {
  try {
    const parsed = parseCalendarMonthInput(calendarMonthInput);
    const probe = new Date(parsed.calendarYear, parsed.calendarMonthIndex, 1);

    if (
      Number.isNaN(probe.getTime()) ||
      probe.getFullYear() !== parsed.calendarYear ||
      probe.getMonth() !== parsed.calendarMonthIndex
    ) {
      throw new Error('invalid calendar month');
    }

    return parsed;
  } catch {
    const today = new Date();

    return {
      calendarYear: today.getFullYear(),
      calendarMonthIndex: today.getMonth(),
    };
  }
}
