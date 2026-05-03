import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import AuthorWelcomeModal from './AuthorWelcomeModal';
import MoodAnalysisWorkspace from './MoodAnalysisWorkspace/MoodAnalysisWorkspace';
import PatientNoteForm from './PatientNoteForm/PatientNoteForm';
import PatientNotesWorkspace from './PatientNotesWorkspace/PatientNotesWorkspace';
import { samplePatientNote, samplePatientNotes } from '../testing/UiKitFixtures';

jest.mock('./MoodTrendChart/MoodTrendChart', () => ({
  __esModule: true,
  default: function MockMoodTrendChart() {
    return <div data-testid="mock-mood-trend-chart">Mock mood trend chart</div>;
  },
}));

jest.mock('@common/shared/services', () => ({
  loadPatientNotes: jest.fn(async () => samplePatientNotes),
}));

describe('Shared organisms', () => {
  it('submits patient note form values', async () => {
    const onSubmit = jest.fn(async () => undefined);
    render(
      <PatientNoteForm
        formId="patient-note-form"
        note={samplePatientNote}
        externalErrorMessage={null}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit(document.getElementById('patient-note-form') as HTMLFormElement);

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it('filters patient notes by selected tag', () => {
    render(
      <PatientNotesWorkspace
        title="My notes"
        notes={samplePatientNotes}
        isLoading={false}
        emptyStateMessage="No notes yet."
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'relationships' }));

    expect(screen.queryByText('A calm day with enough energy to stay focused.')).toBeNull();
    expect(screen.getByText('Lots of energy and social confidence through the evening.')).toBeTruthy();
  });

  it('shows the author welcome modal for a first-time user', async () => {
    window.localStorage.removeItem('mental-health-author-welcome:test-user');
    render(<AuthorWelcomeModal userId="test-user" />);

    expect(await screen.findByText('Author: Nikolay Stepanov')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(window.localStorage.getItem('mental-health-author-welcome:test-user')).toBe('seen');
  });

  it('loads mood analysis notes and renders the analysis heading', async () => {
    render(<MoodAnalysisWorkspace />);

    expect(screen.getByText('Analysis')).toBeTruthy();
    await waitFor(() => expect(screen.getByTestId('mock-mood-trend-chart')).toBeTruthy());
  });
});
