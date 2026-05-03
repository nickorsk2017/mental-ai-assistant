'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { loadPatientNotes } from '@common/shared/services';
import {
  buildDayHourMoodSeries,
  buildMonthDayMoodSeries,
  buildYearMonthMoodSeries,
  formatCalendarDateInput,
  formatCalendarMonthInput,
  parseCalendarDateInput,
} from '@common/shared/utils';
import MoodTrendChart from '../MoodTrendChart/MoodTrendChart';

import MoodAnalysisRangeControls, { type MoodAnalysisRangeKind } from './MoodAnalysisRangeControls';

interface MoodAnalysisWorkspaceProperties {
  showHeading?: boolean;
}

export default React.memo(function MoodAnalysisWorkspace({
  showHeading = true,
}: MoodAnalysisWorkspaceProperties) {
  const mountDateReference = useMemo(() => new Date(), []);
  const [patientNotes, setPatientNotes] = useState<Entity.PatientNote[]>([]);
  const [analysisRangeKind, setAnalysisRangeKind] = useState<MoodAnalysisRangeKind>('month');
  const [selectedCalendarMonthInput, setSelectedCalendarMonthInput] = useState(() =>
    formatCalendarMonthInput(
      mountDateReference.getFullYear(),
      mountDateReference.getMonth(),
    ),
  );
  const [selectedCalendarDateInput, setSelectedCalendarDateInput] = useState(() =>
    formatCalendarDateInput(
      mountDateReference.getFullYear(),
      mountDateReference.getMonth(),
      mountDateReference.getDate(),
    ),
  );
  const [selectedCalendarYear, setSelectedCalendarYear] = useState(
    mountDateReference.getFullYear(),
  );
  const chartContainerReference = useRef<HTMLDivElement>(null);
  const [chartWidthPixels, setChartWidthPixels] = useState(640);

  useEffect(() => {
    let isMounted = true;

    void loadPatientNotes().then((loadedNotes) => {
      if (isMounted) {
        setPatientNotes(loadedNotes);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const containerElement = chartContainerReference.current;

    if (!containerElement || typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const nextWidthPixels = Math.floor(entry.contentRect.width);

      setChartWidthPixels(nextWidthPixels > 0 ? nextWidthPixels : 640);
    });

    resizeObserver.observe(containerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const moodTrendSeries = useMemo(() => {
    if (analysisRangeKind === 'month') {
      const [calendarYearString, calendarMonthString] = selectedCalendarMonthInput.split('-');
      const calendarYear = Number(calendarYearString);
      const calendarMonthIndex = Number(calendarMonthString) - 1;

      return buildMonthDayMoodSeries(patientNotes, calendarYear, calendarMonthIndex);
    }

    if (analysisRangeKind === 'hours') {
      const { calendarYear, calendarMonthIndex, dayOfMonth } =
        parseCalendarDateInput(selectedCalendarDateInput);

      return buildDayHourMoodSeries(patientNotes, calendarYear, calendarMonthIndex, dayOfMonth);
    }

    return buildYearMonthMoodSeries(patientNotes, selectedCalendarYear);
  }, [
    analysisRangeKind,
    patientNotes,
    selectedCalendarDateInput,
    selectedCalendarMonthInput,
    selectedCalendarYear,
  ]);

  const hasAnyScoreInSeries = useMemo(
    () => moodTrendSeries.some((datum) => datum.averageMoodScore !== null),
    [moodTrendSeries],
  );

  const chartHeightPixels = 340;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-calm-surface px-4 py-6 sm:px-8">
      {showHeading ? (
        <header className="shrink-0 border-b border-calm-border/45 pb-4">
          <h1 className="text-base font-semibold text-calm-text">Analysis</h1>
          <p className="mt-1 text-sm text-calm-muted">
            Average mood score from your notes (1–10 scale).
          </p>
        </header>
      ) : null}

      <MoodAnalysisRangeControls
        analysisRangeKind={analysisRangeKind}
        onAnalysisRangeKindChange={setAnalysisRangeKind}
        selectedCalendarMonthInput={selectedCalendarMonthInput}
        onSelectedCalendarMonthInputChange={setSelectedCalendarMonthInput}
        selectedCalendarYear={selectedCalendarYear}
        onSelectedCalendarYearChange={setSelectedCalendarYear}
        selectedCalendarDateInput={selectedCalendarDateInput}
        onSelectedCalendarDateInputChange={setSelectedCalendarDateInput}
      />

      <div ref={chartContainerReference} className="min-h-[340px] w-full min-w-0 overflow-x-auto">
        {!hasAnyScoreInSeries ? (
          <p className="rounded-[28px] border border-calm-border/50 bg-calm-surface/70 px-6 py-8 text-center text-sm text-calm-muted">
            No mood scores in this period. Add notes with a mood score to see the trend line.
          </p>
        ) : (
          <MoodTrendChart
            chartHeightPixels={chartHeightPixels}
            chartWidthPixels={chartWidthPixels}
            moodTrendData={moodTrendSeries}
            rangeKind={analysisRangeKind}
          />
        )}
      </div>
    </div>
  );
});
