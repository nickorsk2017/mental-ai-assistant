import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import PatientNoteForm from './PatientNoteForm';

const meta: Meta<typeof PatientNoteForm> = {
  title: 'Organisms/PatientNoteForm',
  component: PatientNoteForm,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type PatientNoteFormStory = StoryObj<typeof PatientNoteForm>;

const mockNote: Entity.PatientNote = {
  id: '1',
  moodKey: null,
  moodLabel: 'Optimistic',
  moodScore: 7,
  activityTags: ['exercise', 'social'],
  summaryText: 'Had a great day with friends',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const Empty: PatientNoteFormStory = {
  args: {
    formId: 'create-note-form',
    note: null,
    externalErrorMessage: null,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const WithExistingNote: PatientNoteFormStory = {
  args: {
    formId: 'edit-note-form',
    note: mockNote,
    externalErrorMessage: null,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};

export const WithError: PatientNoteFormStory = {
  args: {
    formId: 'error-note-form',
    note: null,
    externalErrorMessage: 'Failed to save note. Please try again.',
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
};
