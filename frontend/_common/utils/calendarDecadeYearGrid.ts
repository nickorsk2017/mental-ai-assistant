export function getDecadeStartYear(calendarYear: number): number {
  return Math.floor(calendarYear / 10) * 10;
}

export function clampCalendarYear(
  calendarYear: number,
  minimumCalendarYear: number,
  maximumCalendarYear: number,
): number {
  return Math.min(maximumCalendarYear, Math.max(minimumCalendarYear, calendarYear));
}

export function shiftDecadeStartYear(
  decadeStartYear: number,
  decadeDirection: -1 | 1,
  minimumCalendarYear: number,
  maximumCalendarYear: number,
): number {
  const candidateDecadeStart = decadeStartYear + decadeDirection * 10;
  const minimumDecadeStart = getDecadeStartYear(minimumCalendarYear);
  const maximumDecadeStart = getDecadeStartYear(maximumCalendarYear);

  return Math.min(
    maximumDecadeStart,
    Math.max(minimumDecadeStart, candidateDecadeStart),
  );
}

export function buildDecadeYearCells(
  decadeStartYear: number,
  minimumCalendarYear: number,
  maximumCalendarYear: number,
): Array<number | null> {
  const yearCells: Array<number | null> = [];

  for (let offset = 0; offset < 10; offset++) {
    const calendarYear = decadeStartYear + offset;

    if (calendarYear < minimumCalendarYear || calendarYear > maximumCalendarYear) {
      yearCells.push(null);
    } else {
      yearCells.push(calendarYear);
    }
  }

  return yearCells;
}
