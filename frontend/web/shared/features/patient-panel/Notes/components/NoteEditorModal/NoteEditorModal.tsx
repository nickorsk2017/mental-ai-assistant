'use client';

import React, { useMemo } from 'react';

import { Button, Modal, PatientNoteForm } from '@common/shared/ui-kit';

interface NoteEditorModalProps {
  note: Entity.PatientNote | null;
  isOpen: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSave: (input: Entity.PatientNoteMutationInput) => Promise<void>;
}

const formId = 'patient-note-editor-form';

export default React.memo(function NoteEditorModal({
  note,
  isOpen,
  isSaving,
  errorMessage,
  onClose,
  onSave,
}: NoteEditorModalProps) {
  const title = useMemo(() => (note ? 'Edit note' : 'New note'), [note]);

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
      <PatientNoteForm
        formId={formId}
        note={note}
        externalErrorMessage={errorMessage}
        onSubmit={onSave}
      />
    </Modal>
  );
});
