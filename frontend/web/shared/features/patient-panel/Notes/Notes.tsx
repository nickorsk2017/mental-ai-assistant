'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { usePatientNotesCrud, usePatientNotesGrouping } from '@common/shared/hooks';
import { Button, PanelPageHeader } from '@common/shared/ui-kit';

import Legends from './components/Legends/Legends';
import NoteCard from './components/NoteCard/NoteCard';
import NoteEditorModal from './components/NoteEditorModal/NoteEditorModal';

const allTagsValue = 'all';

const Notes = React.memo(function Notes() {
  const { collectPatientNoteTags, groupPatientNotes } = usePatientNotesGrouping();
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
  const [selectedTag, setSelectedTag] = useState(allTagsValue);

  const availableTags = useMemo(
    () => collectPatientNoteTags(notes),
    [notes, collectPatientNoteTags],
  );
  const filteredNotes = useMemo(
    () => notes.filter((note) => selectedTag === allTagsValue || note.activityTags.includes(selectedTag)),
    [notes, selectedTag],
  );
  const groupedNotes = useMemo<Entity.PatientNoteGroup[]>(
    () => groupPatientNotes(filteredNotes),
    [filteredNotes, groupPatientNotes],
  );

  const handleDeleteNote = useCallback(async (noteId: string) => {
    if (!window.confirm('Delete this note?')) {
      return;
    }

    await deleteNote(noteId);
  }, [deleteNote]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-calm-surface">
      <PanelPageHeader
        title="My notes"
        onPrimaryAction={openCreateEditor}
        primaryActionAriaLabel="Create note"
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto flex w-full max-w-[56rem] flex-col gap-5">
          <Legends />

          <div className="flex flex-wrap gap-2">
            {[allTagsValue, ...availableTags].map((tag) => (
              <Button
                key={tag}
                type="button"
                wide={false}
                size="small"
                rounded
                variant={selectedTag === tag ? 'primary' : 'outline'}
                onClick={() => setSelectedTag(tag)}
              >
                {tag === allTagsValue ? 'All' : tag}
              </Button>
            ))}
          </div>

          {isLoading && <p className="py-16 text-center text-sm text-calm-muted">Loading notes...</p>}

          {!isLoading && groupedNotes.length === 0 && (
            <p className="rounded-lg border border-calm-border/50 bg-calm-surface/70 px-6 py-10 text-center text-sm text-calm-muted shadow-subtle">
              AI notes will appear here after Serene processes your chat messages.
            </p>
          )}

          {groupedNotes.map((group) => (
            <section key={group.label} className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-calm-muted">{group.label}</h2>
              {group.notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={openEditEditor}
                  onDelete={handleDeleteNote}
                />
              ))}
            </section>
          ))}
        </div>
      </div>
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
