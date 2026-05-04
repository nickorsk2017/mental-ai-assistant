import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import Modal from './Modal';

describe('Modal', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <Modal
        isOpen={false}
        title="Test Modal"
        onClose={() => {}}
      >
        Modal content
      </Modal>
    );
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('renders title and children when isOpen is true', () => {
    render(
      <Modal
        isOpen={true}
        title="My Modal"
        onClose={() => {}}
      >
        <div>Modal body content</div>
      </Modal>
    );
    expect(screen.getByText('My Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal body content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal
        isOpen={true}
        title="Modal"
        onClose={handleClose}
      >
        Content
      </Modal>
    );
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = jest.fn();
    render(
      <Modal
        isOpen={true}
        title="Modal"
        onClose={handleClose}
      >
        Content
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders footer when provided', () => {
    render(
      <Modal
        isOpen={true}
        title="Modal"
        onClose={() => {}}
        footer={<div>Footer content</div>}
      >
        Body
      </Modal>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});
