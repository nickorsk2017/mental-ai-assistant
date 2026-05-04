import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import PanelPageHeader from './PanelPageHeader';

describe('PanelPageHeader', () => {
  it('renders title', () => {
    render(<PanelPageHeader title="My Title" />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders action button when onPrimaryAction is provided', () => {
    const handleAction = jest.fn();
    render(
      <PanelPageHeader
        title="Page Title"
        onPrimaryAction={handleAction}
        primaryActionAriaLabel="Add item"
      />
    );
    const button = screen.getByLabelText('Add item');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('does not render action button without onPrimaryAction', () => {
    render(<PanelPageHeader title="Simple Header" />);
    expect(screen.queryByLabelText('Add item')).not.toBeInTheDocument();
  });
});
