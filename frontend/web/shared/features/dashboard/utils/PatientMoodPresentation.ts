export type MoodBand = 'euphoria' | 'depression' | 'normal' | 'unknown';

export function resolveMoodBand(moodScore: number | null): MoodBand {
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

export function resolveMoodCardClasses(moodScore: number | null): string {
  const moodBand = resolveMoodBand(moodScore);

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

export function resolveMoodDotClasses(moodBand: MoodBand): string {
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
