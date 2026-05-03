'use client';

import React from 'react';

import { Button } from '../../atoms/Button/Button';
import DayPicker from '../../molecules/DayPicker/DayPicker';
import MonthPicker from '../../molecules/MonthPicker/MonthPicker';
import YearPicker from '../../molecules/YearPicker/YearPicker';

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
  const compactMobileButtonClassName =
    'min-h-[24px] px-2.5 py-1 text-[13px] sm:min-h-[34px] sm:px-3.5 sm:py-2 sm:text-label';

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-center md:justify-start">
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
          className={compactMobileButtonClassName}
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
          className={compactMobileButtonClassName}
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
          className={compactMobileButtonClassName}
          onClick={() => onAnalysisRangeKindChange('hours')}
        >
          Hours
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {analysisRangeKind === 'month' ? (
          <MonthPicker
            label="Calendar month"
            value={selectedCalendarMonthInput}
            onChange={onSelectedCalendarMonthInputChange}
            minimumCalendarYear={2000}
            maximumCalendarYear={2100}
          />
        ) : null}
        {analysisRangeKind === 'year' ? (
          <YearPicker
            label="Calendar year"
            value={selectedCalendarYear}
            onChange={onSelectedCalendarYearChange}
            minimumCalendarYear={2000}
            maximumCalendarYear={2100}
          />
        ) : null}
        {analysisRangeKind === 'hours' ? (
          <DayPicker
            label="Calendar day"
            value={selectedCalendarDateInput}
            onChange={onSelectedCalendarDateInputChange}
          />
        ) : null}
      </div>
    </>
  );
});
