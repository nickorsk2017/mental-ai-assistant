import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import Collapse from './Collapse';

describe('Collapse', () => {
  it('renders header and hides content when closed by default', () => {
    render(
      <Collapse header="Click to expand">
        <div>Hidden content</div>
      </Collapse>
    );
    expect(screen.getByText('Click to expand')).toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeVisible();
  });

  it('toggles content visibility when header is clicked', () => {
    render(
      <Collapse header="Toggle me">
        <div>Toggled content</div>
      </Collapse>
    );
    const button = screen.getByRole('button', { name: 'Toggle me' });
    expect(screen.queryByText('Toggled content')).not.toBeVisible();
    fireEvent.click(button);
    expect(screen.getByText('Toggled content')).toBeVisible();
    fireEvent.click(button);
    expect(screen.queryByText('Toggled content')).not.toBeVisible();
  });

  it('renders content open when defaultOpen is true', () => {
    render(
      <Collapse header="Open by default" defaultOpen>
        <div>Visible content</div>
      </Collapse>
    );
    expect(screen.getByText('Visible content')).toBeVisible();
  });
});
