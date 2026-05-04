import type { Meta, StoryObj } from '@storybook/react';
import PatientNotesWorkspace from './PatientNotesWorkspace';

const meta: Meta<typeof PatientNotesWorkspace> = {
  title: 'Organisms/PatientNotesWorkspace',
  component: PatientNotesWorkspace,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type PatientNotesWorkspaceStory = StoryObj<typeof PatientNotesWorkspace>;

const mockNotes: Entity.PatientNote[] = [
  {
    id: '1',
    moodKey: null,
    moodLabel: 'Energetic',
    moodScore: 8,
    activityTags: ['exercise', 'social'],
    summaryText: 'Great day with friends and a morning run',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    moodKey: null,
    moodLabel: 'Calm',
    moodScore: 6,
    activityTags: ['meditation'],
    summaryText: 'Peaceful meditation session in the morning',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const Empty: PatientNotesWorkspaceStory = {
  args: {
    title: 'My Notes',
    notes: [],
    isLoading: false,
    emptyStateMessage: 'No notes yet. Create your first note!',
    onCreateNote: () => undefined,
  },
};

export const WithNotes: PatientNotesWorkspaceStory = {
  args: {
    title: 'My Notes',
    notes: mockNotes,
    isLoading: false,
    emptyStateMessage: 'No notes found',
    onCreateNote: () => undefined,
    onEditNote: (note) => undefined,
    onDeleteNote: (noteId) => undefined,
  },
};

export const Loading: PatientNotesWorkspaceStory = {
  args: {
    title: 'My Notes',
    notes: [],
    isLoading: true,
    emptyStateMessage: 'No notes found',
  },
};

export const ReadOnly: PatientNotesWorkspaceStory = {
  args: {
    title: 'My Notes',
    notes: mockNotes,
    isLoading: false,
    emptyStateMessage: 'No notes found',
  },
};
