import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import PatientNotesWorkspace from './PatientNotesWorkspace';

jest.mock('../../../hooks', () => ({
  usePatientMoodPresentation: () => ({
    resolveMoodBand: () => 'unknown' as Entity.PatientNoteMoodBand,
    resolveMoodCardClasses: () => '',
    resolveMoodScoreBadgeClasses: () => '',
    resolveMoodDotClasses: () => '',
  }),
  usePatientNotesGrouping: jest.fn(() => ({
    collectPatientNoteTags: jest.fn((notes: Entity.PatientNote[]) =>
      Array.from(new Set(notes.flatMap((patientNote) => patientNote.activityTags))),
    ),
    groupPatientNotes: jest.fn((notes: Entity.PatientNote[]) =>
      notes.length === 0 ? [] : [{ label: 'Today', notes }],
    ),
  })),
}));

describe('PatientNotesWorkspace', () => {
  const mockNotes: Entity.PatientNote[] = [
    {
      id: '1',
      moodKey: null,
      moodLabel: 'Happy',
      moodScore: 8,
      activityTags: ['exercise'],
      summaryText: 'Felt great today',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('renders empty state when no notes present', () => {
    render(
      <PatientNotesWorkspace
        title="My Notes"
        notes={[]}
        isLoading={false}
        emptyStateMessage="No notes yet"
      />
    );

    expect(screen.getByText('My Notes')).toBeTruthy();
    expect(screen.getByText('No notes yet')).toBeTruthy();
  });

  it('renders loading state', () => {
    render(
      <PatientNotesWorkspace
        title="My Notes"
        notes={[]}
        isLoading={true}
        emptyStateMessage="No notes"
      />
    );

    expect(screen.getByText('Loading notes...')).toBeTruthy();
  });

  it('renders list of notes when data provided', () => {
    render(
      <PatientNotesWorkspace
        title="My Notes"
        notes={mockNotes}
        isLoading={false}
        emptyStateMessage="No notes yet"
        onCreateNote={() => undefined}
      />
    );

    expect(screen.getByText('My Notes')).toBeTruthy();
  });
});
