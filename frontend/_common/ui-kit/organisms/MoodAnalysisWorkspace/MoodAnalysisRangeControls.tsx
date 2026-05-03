'use client';

import React from 'react';

import { Button } from '../../atoms/Button/Button';

export type MoodAnalysisRangeKind = 'month' | 'year' | 'hours';

interface MoodAnalysisRangeControlsProperties {
  analysisRangeKind: MoodAnalysisRangeKind;
  onAnalysisRangeKindChange: (nextKind: MoodAnalysisRangeKind) => void;
  selectedCalendarMonthInput: string;
  onSelectedCalendarMonthInputChange: (nextValue: string) => void;
  selectedCalendarYear: number;
  onSelectedCalendarYearChange: (nextYear: number) => void;
  selectedCalendarDateInput: string;
  onSelectedCalendarDateInputChange: (nextValue: string) => void;
}

export default React.memo(function MoodAnalysisRangeControls({
  analysisRangeKind,
  onAnalysisRangeKindChange,
  selectedCalendarMonthInput,
  onSelectedCalendarMonthInputChange,
  selectedCalendarYear,
  onSelectedCalendarYearChange,
  selectedCalendarDateInput,
  onSelectedCalendarDateInputChange,
}: MoodAnalysisRangeControlsProperties) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-calm-muted">Range</span>
        <Button
          variant={
            analysisRangeKind === 'month'
              ? "black"
              : "outline"
          }
          rounded
          wide={false}
          size="small"
          onClick={() => onAnalysisRangeKindChange('month')}
        >
          Month
        </Button>
        <Button
          variant={
            analysisRangeKind === 'year'
              ? "black"
              : "outline"
          }
          size="small"
          wide={false}
          rounded
          onClick={() => onAnalysisRangeKindChange('year')}
        >
          Year
        </Button>
        <Button
          variant={
            analysisRangeKind === 'hours'
              ? "black"
              : "outline"
          }
          size="small"
          wide={false}
          rounded
          onClick={() => onAnalysisRangeKindChange('hours')}
        >
          Hours
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {analysisRangeKind === 'month' ? (
          <label className="flex flex-col gap-1 text-sm text-calm-muted">
            Calendar month
            <input
              type="month"
              value={selectedCalendarMonthInput}
              onChange={(changeEvent) =>
                onSelectedCalendarMonthInputChange(changeEvent.target.value)
              }
              className="rounded-xl border border-calm-border bg-calm-surface px-3 py-2 text-sm text-calm-text"
            />
          </label>
        ) : null}
        {analysisRangeKind === 'year' ? (
          <label className="flex flex-col gap-1 text-sm text-calm-muted">
            Calendar year
            <input
              type="number"
              min={2000}
              max={2100}
              value={selectedCalendarYear}
              onChange={(changeEvent) =>
                onSelectedCalendarYearChange(Number(changeEvent.target.value))
              }
              className="w-32 rounded-xl border border-calm-border bg-calm-surface px-3 py-2 text-sm text-calm-text"
            />
          </label>
        ) : null}
        {analysisRangeKind === 'hours' ? (
          <label className="flex flex-col gap-1 text-sm text-calm-muted">
            Calendar day
            <input
              type="date"
              value={selectedCalendarDateInput}
              onChange={(changeEvent) =>
                onSelectedCalendarDateInputChange(changeEvent.target.value)
              }
              className="rounded-xl border border-calm-border bg-calm-surface px-3 py-2 text-sm text-calm-text"
            />
          </label>
        ) : null}
      </div>
    </>
  );
});
