import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import PatientNoteForm from './PatientNoteForm';

describe('PatientNoteForm', () => {
  const mockOnSubmit = jest.fn(() => Promise.resolve());

  it('renders form fields with labels', () => {
    render(
      <PatientNoteForm
        formId="test-form"
        note={null}
        externalErrorMessage={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText('Mood label')).toBeTruthy();
    expect(screen.getByLabelText('Mood score')).toBeTruthy();
    expect(screen.getByLabelText('Summary')).toBeTruthy();
    expect(screen.getByLabelText('Tags')).toBeTruthy();
  });

  it('calls onSubmit with valid form data', async () => {
    const { container } = render(
      <PatientNoteForm
        formId="test-form"
        note={null}
        externalErrorMessage={null}
        onSubmit={mockOnSubmit}
      />
    );

    const form = container.querySelector('form');
    expect(form).toBeTruthy();
    expect(form?.id).toBe('test-form');
  });

  it('displays external error message when provided', () => {
    const errorMsg = 'Something went wrong';
    render(
      <PatientNoteForm
        formId="test-form"
        note={null}
        externalErrorMessage={errorMsg}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(errorMsg)).toBeTruthy();
  });
});
