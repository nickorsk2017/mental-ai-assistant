export interface MoodTrendDatum {
  domainPosition: number;
  tickLabel: string;
  averageMoodScore: number | null;
}

export function formatCalendarMonthInput(calendarYear: number, calendarMonthIndex: number): string {
  const monthNumber = calendarMonthIndex + 1;

  return `${calendarYear}-${monthNumber.toString().padStart(2, '0')}`;
}

export function formatCalendarDateInput(
  calendarYear: number,
  calendarMonthIndex: number,
  dayOfMonth: number,
): string {
  return `${calendarYear}-${String(calendarMonthIndex + 1).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`;
}

export function parseCalendarDateInput(calendarDateInput: string): {
  calendarYear: number;
  calendarMonthIndex: number;
  dayOfMonth: number;
} {
  const [yearSegment, monthSegment, daySegment] = calendarDateInput.split('-');

  return {
    calendarYear: Number(yearSegment),
    calendarMonthIndex: Number(monthSegment) - 1,
    dayOfMonth: Number(daySegment),
  };
}

export const calendarMonthLabelsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function buildMonthDayMoodSeries(
  patientNotes: Entity.PatientNote[],
  calendarYear: number,
  calendarMonthIndex: number,
): MoodTrendDatum[] {
  const daysInMonth = new Date(calendarYear, calendarMonthIndex + 1, 0).getDate();
  const scoresByDayOfMonth = new Map<number, number[]>();

  for (const patientNote of patientNotes) {
    if (patientNote.moodScore === null) {
      continue;
    }

    const createdDate = new Date(patientNote.createdAt);

    if (
      createdDate.getFullYear() !== calendarYear ||
      createdDate.getMonth() !== calendarMonthIndex
    ) {
      continue;
    }

    const dayOfMonth = createdDate.getDate();
    const previousScores = scoresByDayOfMonth.get(dayOfMonth) ?? [];

    previousScores.push(patientNote.moodScore);
    scoresByDayOfMonth.set(dayOfMonth, previousScores);
  }

  const monthDaySeries: MoodTrendDatum[] = [];

  for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth += 1) {
    const moodScoresForDay = scoresByDayOfMonth.get(dayOfMonth);
    const averageMoodScore =
      moodScoresForDay !== undefined && moodScoresForDay.length > 0
        ? moodScoresForDay.reduce((sum, value) => sum + value, 0) / moodScoresForDay.length
        : null;

    monthDaySeries.push({
      domainPosition: dayOfMonth,
      tickLabel: String(dayOfMonth),
      averageMoodScore,
    });
  }

  return monthDaySeries;
}

export function buildYearMonthMoodSeries(
  patientNotes: Entity.PatientNote[],
  calendarYear: number,
): MoodTrendDatum[] {
  const scoresByCalendarMonthIndex = new Map<number, number[]>();

  for (const patientNote of patientNotes) {
    if (patientNote.moodScore === null) {
      continue;
    }

    const createdDate = new Date(patientNote.createdAt);

    if (createdDate.getFullYear() !== calendarYear) {
      continue;
    }

    const calendarMonthIndex = createdDate.getMonth();
    const previousScores = scoresByCalendarMonthIndex.get(calendarMonthIndex) ?? [];

    previousScores.push(patientNote.moodScore);
    scoresByCalendarMonthIndex.set(calendarMonthIndex, previousScores);
  }

  const yearMonthSeries: MoodTrendDatum[] = [];

  for (
    let calendarMonthIndex = 0;
    calendarMonthIndex < 12;
    calendarMonthIndex += 1
  ) {
    const moodScoresForMonth = scoresByCalendarMonthIndex.get(calendarMonthIndex);
    const averageMoodScore =
      moodScoresForMonth !== undefined && moodScoresForMonth.length > 0
        ? moodScoresForMonth.reduce((sum, value) => sum + value, 0) /
          moodScoresForMonth.length
        : null;

    yearMonthSeries.push({
      domainPosition: calendarMonthIndex,
      tickLabel: calendarMonthLabelsShort[calendarMonthIndex],
      averageMoodScore,
    });
  }

  return yearMonthSeries;
}

export function buildDayHourMoodSeries(
  patientNotes: Entity.PatientNote[],
  calendarYear: number,
  calendarMonthIndex: number,
  dayOfMonth: number,
): MoodTrendDatum[] {
  const moodScoresByHourOfDay = new Map<number, number[]>();

  for (const patientNote of patientNotes) {
    if (patientNote.moodScore === null) {
      continue;
    }

    const createdDate = new Date(patientNote.createdAt);

    if (
      createdDate.getFullYear() !== calendarYear ||
      createdDate.getMonth() !== calendarMonthIndex ||
      createdDate.getDate() !== dayOfMonth
    ) {
      continue;
    }

    const hourOfDay = createdDate.getHours();
    const previousScores = moodScoresByHourOfDay.get(hourOfDay) ?? [];

    previousScores.push(patientNote.moodScore);
    moodScoresByHourOfDay.set(hourOfDay, previousScores);
  }

  const dayHourSeries: MoodTrendDatum[] = [];

  for (let hourOfDay = 0; hourOfDay < 24; hourOfDay += 1) {
    const moodScoresForHour = moodScoresByHourOfDay.get(hourOfDay);
    const averageMoodScore =
      moodScoresForHour !== undefined && moodScoresForHour.length > 0
        ? moodScoresForHour.reduce((sum, value) => sum + value, 0) / moodScoresForHour.length
        : null;

    dayHourSeries.push({
      domainPosition: hourOfDay,
      tickLabel: `${hourOfDay.toString().padStart(2, '0')}:00`,
      averageMoodScore,
    });
  }

  return dayHourSeries;
}
