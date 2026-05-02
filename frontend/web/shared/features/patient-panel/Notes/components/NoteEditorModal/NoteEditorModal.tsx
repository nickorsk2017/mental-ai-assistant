'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { Button, Modal, TextArea, TextInput } from '@common/shared/ui-kit';

interface NoteEditorModalProps {
  note: Entity.PatientNote | null;
  isOpen: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSave: (input: Entity.PatientNoteMutationInput) => Promise<void>;
}

const formId = 'patient-note-editor-form';

function formatTags(tags: string[]): string {
  return tags.join(', ');
}

function parseTags(tagsText: string): string[] {
  return Array.from(
    new Set(tagsText.split(',').map((tag) => tag.trim()).filter(Boolean)),
  );
}

function parseMoodScore(moodScoreText: string): number | null {
  if (!moodScoreText.trim()) {
    return null;
  }

  const parsedMoodScore = Number(moodScoreText);

  return Number.isFinite(parsedMoodScore) && parsedMoodScore >= 1 && parsedMoodScore <= 10
    ? parsedMoodScore
    : null;
}

export default React.memo(function NoteEditorModal({
  note,
  isOpen,
  isSaving,
  errorMessage,
  onClose,
  onSave,
}: NoteEditorModalProps) {
  const [moodLabel, setMoodLabel] = useState('');
  const [moodScore, setMoodScore] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [tagsText, setTagsText] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMoodLabel(note?.moodLabel ?? '');
    setMoodScore(note?.moodScore === null || note?.moodScore === undefined ? '' : String(note.moodScore));
    setSummaryText(note?.summaryText ?? '');
    setMessageText(note?.messageText ?? '');
    setTagsText(formatTags(note?.activityTags ?? []));
  }, [isOpen, note]);

  const title = useMemo(() => (note ? 'Edit note' : 'New note'), [note]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSave({
      moodLabel: moodLabel.trim() || null,
      moodScore: parseMoodScore(moodScore),
      activityTags: parseTags(tagsText),
      messageText: messageText.trim(),
      summaryText: summaryText.trim() || null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      formId={formId}
      closeLabel="Close note editor"
      bodyClassName="flex flex-col gap-4"
      footer={(
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onClose} variant="outline" wide={false} className="px-4 py-2 text-sm text-calm-muted">
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={isSaving} wide={false} className="px-4 py-2 text-sm">
            {isSaving ? 'Saving...' : 'Save note'}
          </Button>
        </div>
      )}
    >
      <form id={formId} onSubmit={handleSubmit} className="contents">
        <TextInput
          value={moodLabel}
          onChange={setMoodLabel}
          label="Mood label"
          placeholder="normal, euphoric, energized"
          autoFocus
        />

        <TextInput
          value={moodScore}
          onChange={setMoodScore}
          label="Mood score"
          placeholder="1-10"
        />

        <TextArea
          value={summaryText}
          onChange={setSummaryText}
          label="Summary"
          rows={4}
          placeholder="Short note shown in the card"
        />

        <TextArea
          value={messageText}
          onChange={setMessageText}
          label="Original message"
          rows={5}
          placeholder="Full note text"
        />

        <TextInput
          value={tagsText}
          onChange={setTagsText}
          label="Tags"
          placeholder="health, finances, work"
        />

        {errorMessage && <p className="text-sm font-medium text-calm-error">{errorMessage}</p>}
      </form>
    </Modal>
  );
});
