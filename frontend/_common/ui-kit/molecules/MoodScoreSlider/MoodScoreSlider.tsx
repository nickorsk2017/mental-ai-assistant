import React, { useId } from 'react';

import { cx } from '../../../utils';

type MoodScoreSliderProps = {
  value: number;
  onChange: (nextValue: number) => void;
  label?: string;
  errorMessage?: string;
  className?: string;
};

const moodScoreMinimum = 1;
const moodScoreMaximum = 10;

export default React.memo(function MoodScoreSlider({
  value,
  onChange,
  label = 'Mood score',
  errorMessage,
  className,
}: MoodScoreSliderProps) {
  const inputIdentifier = useId();
  const safeValue = Math.min(moodScoreMaximum, Math.max(moodScoreMinimum, value));

  return (
    <div className={cx('inline-flex w-full flex-col gap-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <label className="text-label text-calm-muted" htmlFor={inputIdentifier}>
          {label}
        </label>
        <span className="rounded-full border border-calm-border bg-calm-surface px-3 py-1 text-xs font-semibold text-calm-text">
          {safeValue}/10
        </span>
      </div>

      <div className="relative flex h-11 items-center">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 flex h-3 -translate-y-1/2 overflow-hidden rounded-full border border-calm-border bg-calm-surface">
          <span className="h-full basis-[40%] bg-calm-mood-depression" />
          <span className="h-full basis-[30%] bg-calm-mood-normal" />
          <span className="h-full basis-[30%] bg-calm-mood-euphoria" />
        </div>
        <input
          id={inputIdentifier}
          type="range"
          min={moodScoreMinimum}
          max={moodScoreMaximum}
          step={1}
          value={safeValue}
          onChange={(event) => onChange(Number(event.target.value))}
          className={cx(
            'relative z-10 h-11 w-full cursor-pointer appearance-none bg-transparent outline-none',
            'focus-visible:ring-2 focus-visible:ring-calm-primary/20',
            '[&::-moz-range-track]:h-3 [&::-moz-range-track]:bg-transparent',
            '[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-calm-surface [&::-moz-range-thumb]:bg-calm-black [&::-moz-range-thumb]:shadow-subtle',
            '[&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:bg-transparent',
            '[&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-calm-surface [&::-webkit-slider-thumb]:bg-calm-black [&::-webkit-slider-thumb]:shadow-subtle',
          )}
        />
      </div>

      <div className="flex justify-between text-xs font-semibold text-calm-muted">
        <span>1</span>
        <span>4</span>
        <span>7</span>
        <span>10</span>
      </div>
      {errorMessage ? <span className="text-caption text-calm-error">{errorMessage}</span> : null}
    </div>
  );
});
