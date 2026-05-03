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
