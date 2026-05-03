import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import AuthorWelcomeModal from './AuthorWelcomeModal';
import { AuthForm } from './AuthForm/AuthForm';
import MoodAnalysisWorkspace from './MoodAnalysisWorkspace/MoodAnalysisWorkspace';
import PatientNoteForm from './PatientNoteForm/PatientNoteForm';
import PatientNotesWorkspace from './PatientNotesWorkspace/PatientNotesWorkspace';
import { buildSuccessEnvelope, samplePatientNote, samplePatientNotes } from '../testing/UiKitFixtures';

const meta: Meta = {
  title: 'Organisms/Shared UI',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type SharedOrganismsStory = StoryObj;

export const NotesAndForms: SharedOrganismsStory = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-6">
      <PatientNoteForm
        formId="storybook-patient-note-form"
        note={samplePatientNote}
        externalErrorMessage={null}
        onSubmit={async () => undefined}
      />
      <PatientNotesWorkspace
        title="My notes"
        notes={samplePatientNotes}
        isLoading={false}
        emptyStateMessage="No notes yet."
        onCreateNote={() => undefined}
      />
    </div>
  ),
};

export const AuthAndWelcome: SharedOrganismsStory = {
  render: () => {
    window.localStorage.removeItem('mental-health-author-welcome:storybook-user');
    return (
      <div className="flex max-w-3xl flex-col gap-6">
        <AuthForm />
        <AuthorWelcomeModal userId="storybook-user" />
      </div>
    );
  },
};

export const MoodAnalysis: SharedOrganismsStory = {
  render: () => {
    globalThis.fetch = async () =>
      ({ ok: true, json: async () => buildSuccessEnvelope(samplePatientNotes) }) as Response;
    return <MoodAnalysisWorkspace />;
  },
};
