'use client';

import React, { useMemo } from 'react';

import Button from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { buildDecadeYearCells } from '../../../utils';

interface YearPickerDecadeGridProperties {
  decadeStartYear: number;
  selectedCalendarYear: number;
  minimumCalendarYear: number;
  maximumCalendarYear: number;
  onSelectCalendarYear: (calendarYear: number) => void;
  onPreviousDecade: () => void;
  onNextDecade: () => void;
}

export default React.memo(function YearPickerDecadeGrid({
  decadeStartYear,
  selectedCalendarYear,
  minimumCalendarYear,
  maximumCalendarYear,
  onSelectCalendarYear,
  onPreviousDecade,
  onNextDecade,
}: YearPickerDecadeGridProperties) {
  const yearCells = useMemo(
    () => buildDecadeYearCells(decadeStartYear, minimumCalendarYear, maximumCalendarYear),
    [decadeStartYear, maximumCalendarYear, minimumCalendarYear],
  );

  const decadeRangeLabel = `${decadeStartYear} – ${decadeStartYear + 9}`;

  return (
    <div className="w-full min-w-[260px]">
      <div className="mb-2 flex items-center gap-2 border-b border-calm-border/50 pb-2">
        <Button
          type="button"
          variant="ghost"
          size="small"
          wide={false}
          rounded
          className="!h-8 !w-8 shrink-0 !min-h-0 !p-0 text-calm-muted"
          aria-label="Previous decade"
          onClick={onPreviousDecade}
        >
          <Icon name="arrow-left" size={18} color="currentColor" />
        </Button>
        <span className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-calm-text">
          {decadeRangeLabel}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="small"
          wide={false}
          rounded
          className="!h-8 !w-8 shrink-0 !min-h-0 !p-0 text-calm-muted"
          aria-label="Next decade"
          onClick={onNextDecade}
        >
          <Icon name="arrow-left" size={18} color="currentColor" className="rotate-180" />
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {yearCells.map((calendarYear, cellIndex) => {
          if (calendarYear === null) {
            return <div key={`empty-${cellIndex}`} className="aspect-square min-h-[40px]" />;
          }

          const isSelected = selectedCalendarYear === calendarYear;

          return (
            <button
              key={`year-${calendarYear}`}
              type="button"
              className={`flex aspect-square min-h-[40px] items-center justify-center rounded-lg text-sm font-medium transition ${
                isSelected
                  ? 'bg-calm-black text-calm-primary-text'
                  : 'text-calm-text hover:bg-calm-background/80'
              }`}
              onClick={() => onSelectCalendarYear(calendarYear)}
            >
              {calendarYear}
            </button>
          );
        })}
      </div>
    </div>
  );
});
