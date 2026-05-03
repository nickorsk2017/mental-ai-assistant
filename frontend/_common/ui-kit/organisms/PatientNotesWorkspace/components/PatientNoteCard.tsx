'use client';

import React from 'react';

import { usePatientMoodPresentation } from '../../../../hooks';
import Button from '../../../atoms/Button/Button';
import { Icon } from '../../../atoms/Icon/Icon';

interface PatientNoteCardProperties {
  note: Entity.PatientNote;
  onEdit?: (note: Entity.PatientNote) => void;
  onDelete?: (noteId: string) => void;
}

export default React.memo(function PatientNoteCard({
  note,
  onEdit,
  onDelete,
}: PatientNoteCardProperties) {
  const { resolveMoodCardClasses, resolveMoodScoreBadgeClasses } = usePatientMoodPresentation();
  const createdTime = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(note.createdAt));

  return (
    <article className={`rounded-lg border px-5 py-4 shadow-[0_8px_18px_rgba(49,58,84,0.08)] ${resolveMoodCardClasses(note.moodScore)}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-calm-text">{note.moodLabel ?? 'Mood note'}</p>
          <p className="mt-1 text-xs text-calm-muted">{createdTime}</p>
        </div>
        <div className="flex items-center gap-2">
          {note.moodScore !== null ? (
            <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${resolveMoodScoreBadgeClasses(note.moodScore)}`}>
              {note.moodScore}/10
            </div>
          ) : null}
          {onEdit || onDelete ? (
            <div className="flex items-center gap-1">
              {onEdit ? (
                <Button
                  type="button"
                  onClick={() => onEdit(note)}
                  variant="outline"
                  size="small"
                  wide={false}
                  rounded
                  className="!h-8 !w-8 !min-h-0 !p-0 text-calm-muted hover:text-calm-primary"
                  aria-label="Edit note"
                >
                  <Icon name="pencil" size={16} color="currentColor" />
                </Button>
              ) : null}
              {onDelete ? (
                <Button
                  type="button"
                  onClick={() => onDelete(note.id)}
                  variant="outline"
                  size="small"
                  wide={false}
                  rounded
                  className="!h-8 !w-8 !min-h-0 !p-0 text-calm-muted hover:text-calm-error"
                  aria-label="Delete note"
                >
                  <Icon name="trash" size={16} color="currentColor" />
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-calm-text">{note.summaryText}</p>

      {note.activityTags.length > 0 ? (
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
      ) : null}
    </article>
  );
});
