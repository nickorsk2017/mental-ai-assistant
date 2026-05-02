import type { PatientNote, PatientNoteGroup } from '../types/PatientNotesTypes';

function startOfDay(date: Date): Date {
  const nextDate = new Date(date);

  nextDate.setHours(0, 0, 0, 0);

  return nextDate;
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function resolveNoteGroupLabel(createdAt: string): string {
  const noteDate = startOfDay(new Date(createdAt));
  const todayDate = startOfDay(new Date());
  const dayDifference = Math.round(
    (todayDate.getTime() - noteDate.getTime()) / 86_400_000,
  );

  if (dayDifference === 0) {
    return 'Today';
  }

  if (dayDifference === 1) {
    return 'Yesterday';
  }

  if (dayDifference > 1 && dayDifference < 7) {
    return 'Last Week';
  }

  return formatDateLabel(noteDate);
}

export function groupPatientNotes(notes: PatientNote[]): PatientNoteGroup[] {
  const groupedNotes = new Map<string, PatientNote[]>();

  for (const note of notes) {
    const label = resolveNoteGroupLabel(note.createdAt);
    const currentNotes = groupedNotes.get(label) ?? [];

    groupedNotes.set(label, [...currentNotes, note]);
  }

  return Array.from(groupedNotes.entries()).map(([label, groupNotes]) => ({
    label,
    notes: groupNotes,
  }));
}

export function collectPatientNoteTags(notes: PatientNote[]): string[] {
  return Array.from(new Set(notes.flatMap((note) => note.activityTags))).sort();
}
