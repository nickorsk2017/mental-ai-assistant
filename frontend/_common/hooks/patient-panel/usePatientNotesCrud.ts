'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createPatientNote,
  deletePatientNote,
  loadPatientNotes,
  updatePatientNote,
} from '@common/shared/services';

export function usePatientNotesCrud() {
  const [notes, setNotes] = useState<Entity.PatientNote[]>([]);
  const [editingNote, setEditingNote] = useState<Entity.PatientNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void loadPatientNotes().then((loadedNotes) => {
      if (isMounted) {
        setNotes(loadedNotes);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateEditor = useCallback(() => {
    setEditingNote(null);
    setEditorError(null);
    setIsEditorOpen(true);
  }, []);

  const openEditEditor = useCallback((note: Entity.PatientNote) => {
    setEditingNote(note);
    setEditorError(null);
    setIsEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    if (isSaving) return;

    setIsEditorOpen(false);
    setEditingNote(null);
    setEditorError(null);
  }, [isSaving]);

  const saveNote = useCallback(
    async (input: Entity.PatientNoteMutationInput) => {
      setIsSaving(true);
      setEditorError(null);

      const response = editingNote
        ? await updatePatientNote(editingNote.id, input)
        : await createPatientNote(input);

      if (!response.success || response.data === null) {
        setEditorError(response.error ?? 'Unable to save note.');
        setIsSaving(false);
        return;
      }

      const savedNote = response.data;

      setNotes((previousNotes) => {
        if (!editingNote) return [savedNote, ...previousNotes];

        return previousNotes.map((note) => (
          note.id === savedNote.id ? savedNote : note
        ));
      });
      setIsSaving(false);
      setIsEditorOpen(false);
      setEditingNote(null);
    },
    [editingNote],
  );

  const deleteNote = useCallback(async (noteId: string) => {
    const response = await deletePatientNote(noteId);

    if (response.success) {
      setNotes((previousNotes) => previousNotes.filter((note) => note.id !== noteId));
    }
  }, []);

  return useMemo(
    () => ({
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
    }),
    [
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
    ],
  );
}
