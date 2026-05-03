import React from 'react';
import { IonContent, IonPage } from '@ionic/react';

import { usePatientNotesCrud } from '@common/shared/hooks';
import { Button, Modal, PatientNoteForm, PatientNotesWorkspace } from '@common/shared/ui-kit';

import { PageHeader } from '../../features/patient-panel/PageHeader';

export function PatientNotesPage(): React.JSX.Element {
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

  const handleDeleteNote = React.useCallback(async (noteId: string) => {
    if (!window.confirm('Delete this note?')) {
      return;
    }

    await deleteNote(noteId);
  }, [deleteNote]);

  return (
    <IonPage>
      <PageHeader title="Notes" />
      <IonContent fullscreen className="ion-padding bg-calm-surface">
        <PatientNotesWorkspace
          title="My notes"
          notes={notes}
          isLoading={isLoading}
          emptyStateMessage="AI notes will appear here after Mental Health processes your chat messages."
          onCreateNote={openCreateEditor}
          onEditNote={openEditEditor}
          onDeleteNote={handleDeleteNote}
        />
        <Modal
          isOpen={isEditorOpen}
          title={editingNote ? 'Edit note' : 'New note'}
          onClose={closeEditor}
          formId="mobile-patient-note-form"
          closeLabel="Close note editor"
          bodyClassName="flex flex-col gap-4"
          footer={(
            <div className="flex justify-end gap-3">
              <Button type="button" onClick={closeEditor} variant="outline" wide={false} className="px-4 py-2 text-sm text-calm-muted">
                Cancel
              </Button>
              <Button type="submit" form="mobile-patient-note-form" disabled={isSaving} variant="black" wide={false} className="px-4 py-2 text-sm">
                {isSaving ? 'Saving...' : 'Save note'}
              </Button>
            </div>
          )}
        >
          <PatientNoteForm
            formId="mobile-patient-note-form"
            note={editingNote}
            externalErrorMessage={editorError}
            onSubmit={saveNote}
          />
        </Modal>
      </IonContent>
    </IonPage>
  );
}
