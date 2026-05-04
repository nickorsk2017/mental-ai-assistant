import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import MoodAnalysisWorkspace from './MoodAnalysisWorkspace';

jest.mock('@common/shared/services', () => ({
  loadPatientNotes: jest.fn(() => Promise.resolve([])),
}));

describe('MoodAnalysisWorkspace', () => {
  it('renders without crashing with default props', async () => {
    render(<MoodAnalysisWorkspace />);

    expect(screen.getByText('Analysis')).toBeTruthy();
    expect(screen.getByText(/Average mood score from your notes/)).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText(/No mood scores in this period/)).toBeInTheDocument();
    });
  });

  it('renders without heading when showHeading is false', async () => {
    render(<MoodAnalysisWorkspace showHeading={false} />);

    expect(screen.queryByText('Analysis')).toBeNull();
    await waitFor(() => {
      expect(screen.getByText(/No mood scores in this period/)).toBeInTheDocument();
    });
  });

  it('displays empty state message when no mood scores present', async () => {
    render(<MoodAnalysisWorkspace />);

    const emptyMessage = await screen.findByText(/No mood scores in this period/);
    expect(emptyMessage).toBeTruthy();
  });
});
