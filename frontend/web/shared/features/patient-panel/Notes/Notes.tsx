'use client';

import React, { useCallback } from 'react';

import { usePatientNotesCrud } from '@common/shared/hooks';
import { PatientNotesWorkspace } from '@common/shared/ui-kit';

import NoteEditorModal from './components/NoteEditorModal/NoteEditorModal';

const Notes = React.memo(function Notes() {
  const {
    notes,
    editingNote,
    isLoading,
    isEditorOpen,
    isSaving,
    editorError,
    openCreateEditor,
    openEditEditor,
    closeEditor,
    saveNote,
    deleteNote,
  } = usePatientNotesCrud();

  const handleDeleteNote = useCallback(async (noteId: string) => {
    if (!window.confirm('Delete this note?')) {
      return;
    }

    await deleteNote(noteId);
  }, [deleteNote]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-calm-surface">
      <PatientNotesWorkspace
        title="My notes"
        notes={notes}
        isLoading={isLoading}
        emptyStateMessage="AI notes will appear here after Mental Health processes your chat messages."
        onCreateNote={openCreateEditor}
        onEditNote={openEditEditor}
        onDeleteNote={handleDeleteNote}
      />
      <NoteEditorModal
        note={editingNote}
        isOpen={isEditorOpen}
        isSaving={isSaving}
        errorMessage={editorError}
        onClose={closeEditor}
        onSave={saveNote}
      />
    </div>
  );
});

export default Notes;
