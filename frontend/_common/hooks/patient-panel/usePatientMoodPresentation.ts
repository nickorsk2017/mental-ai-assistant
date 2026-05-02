'use client';

import { useCallback, useMemo } from 'react';

function resolveMoodBandValue(moodScore: number | null): Entity.PatientNoteMoodBand {
  if (moodScore === null) {
    return 'unknown';
  }

  if (moodScore >= 8) {
    return 'euphoria';
  }

  if (moodScore <= 4) {
    return 'depression';
  }

  return 'normal';
}

function resolveMoodCardClassesValue(moodScore: number | null): string {
  const moodBand = resolveMoodBandValue(moodScore);

  if (moodBand === 'euphoria') {
    return 'border-calm-error/45 bg-calm-error/10';
  }

  if (moodBand === 'depression') {
    return 'border-calm-muted/30 bg-calm-muted/10';
  }

  if (moodBand === 'normal') {
    return 'border-emerald-300/70 bg-emerald-50/80';
  }

  return 'border-calm-border/55 bg-calm-surface/90';
}

function resolveMoodScoreBadgeClassesValue(moodScore: number | null): string {
  const moodBand = resolveMoodBandValue(moodScore);

  if (moodBand === 'euphoria') {
    return 'border-calm-error/50 bg-calm-error/18 text-calm-text';
  }

  if (moodBand === 'depression') {
    return 'border-calm-muted/45 bg-calm-muted/14 text-calm-text';
  }

  if (moodBand === 'normal') {
    return 'border-emerald-400/65 bg-emerald-100 text-calm-text';
  }

  return 'border-calm-border/60 bg-calm-surface text-calm-text';
}

function resolveMoodDotClassesValue(moodBand: Entity.PatientNoteMoodBand): string {
  if (moodBand === 'euphoria') {
    return 'bg-calm-error';
  }

  if (moodBand === 'depression') {
    return 'bg-calm-muted';
  }

  if (moodBand === 'normal') {
    return 'bg-emerald-500';
  }

  return 'bg-calm-muted';
}

export function usePatientMoodPresentation() {
  const resolveMoodBand = useCallback((moodScore: number | null) => {
    return resolveMoodBandValue(moodScore);
  }, []);

  const resolveMoodCardClasses = useCallback((moodScore: number | null) => {
    return resolveMoodCardClassesValue(moodScore);
  }, []);

  const resolveMoodScoreBadgeClasses = useCallback((moodScore: number | null) => {
    return resolveMoodScoreBadgeClassesValue(moodScore);
  }, []);

  const resolveMoodDotClasses = useCallback((moodBand: Entity.PatientNoteMoodBand) => {
    return resolveMoodDotClassesValue(moodBand);
  }, []);

  return useMemo(
    () => ({
      resolveMoodBand,
      resolveMoodCardClasses,
      resolveMoodScoreBadgeClasses,
      resolveMoodDotClasses,
    }),
    [resolveMoodBand, resolveMoodCardClasses, resolveMoodScoreBadgeClasses, resolveMoodDotClasses],
  );
}
