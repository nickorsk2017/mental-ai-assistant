'use client';

import React from 'react';

import { usePatientMoodPresentation } from '@common/shared/hooks';

interface NoteCardProps {
  note: Entity.PatientNote;
}

export default React.memo(function NoteCard({ note }: NoteCardProps) {
  const { resolveMoodCardClasses, resolveMoodScoreBadgeClasses } = usePatientMoodPresentation();

  const createdTime = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(note.createdAt));

  return (
    <article className={`rounded-lg border px-5 py-4 shadow-subtle ${resolveMoodCardClasses(note.moodScore)}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-calm-text">
            {note.moodLabel ?? 'Mood note'}
          </p>
          <p className="mt-1 text-xs text-calm-muted">{createdTime}</p>
        </div>
        {note.moodScore !== null && (
          <div
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${resolveMoodScoreBadgeClasses(note.moodScore)}`}
          >
            {note.moodScore}/10
          </div>
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-calm-text">
        {note.summaryText ?? note.messageText}
      </p>

      {note.activityTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.activityTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-calm-border/50 bg-calm-surface px-3 py-1 text-xs font-medium text-calm-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
});
