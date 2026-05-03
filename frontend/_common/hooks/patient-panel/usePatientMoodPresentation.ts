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
    return 'border-calm-mood-euphoria/20 bg-calm-mood-euphoria-surface';
  }

  if (moodBand === 'depression') {
    return 'border-calm-mood-depression/15 bg-calm-mood-depression-surface';
  }

  if (moodBand === 'normal') {
    return 'border-calm-mood-normal/20 bg-calm-mood-normal-surface';
  }

  return 'border-calm-border/55 bg-calm-surface/90';
}

function resolveMoodScoreBadgeClassesValue(moodScore: number | null): string {
  const moodBand = resolveMoodBandValue(moodScore);

  if (moodBand === 'euphoria') {
    return 'border-calm-mood-euphoria bg-calm-mood-euphoria-surface text-calm-text';
  }

  if (moodBand === 'depression') {
    return 'border-calm-mood-depression bg-calm-mood-depression-surface text-calm-text';
  }

  if (moodBand === 'normal') {
    return 'border-calm-mood-normal bg-calm-mood-normal-surface text-calm-text';
  }

  return 'border-calm-border/60 bg-calm-surface text-calm-text';
}

function resolveMoodDotClassesValue(moodBand: Entity.PatientNoteMoodBand): string {
  if (moodBand === 'euphoria') {
    return 'bg-calm-mood-euphoria';
  }

  if (moodBand === 'depression') {
    return 'bg-calm-mood-depression';
  }

  if (moodBand === 'normal') {
    return 'bg-calm-mood-normal';
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
