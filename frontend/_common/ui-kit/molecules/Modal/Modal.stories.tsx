import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from './Modal';
import Button from '../../atoms/Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Molecules/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type ModalStory = StoryObj<typeof Modal>;

export const Open: ModalStory = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    children: 'Are you sure you want to proceed?',
    onClose: () => {},
  },
};

export const WithFooter: ModalStory = {
  args: {
    isOpen: true,
    title: 'Save Changes',
    children: 'Would you like to save your changes before closing?',
    footer: (
      <div className="flex gap-3 justify-end">
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    ),
    onClose: () => {},
  },
};

export const Closed: ModalStory = {
  args: {
    isOpen: false,
    title: 'Hidden Modal',
    children: 'This modal is not visible',
    onClose: () => {},
  },
};

export const Interactive: ModalStory = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal
          isOpen={isOpen}
          title="Welcome"
          onClose={() => setIsOpen(false)}
          footer={
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Got it
            </Button>
          }
        >
          <p>This is an interactive modal. Click the button below or press Escape to close.</p>
        </Modal>
      </>
    );
  },
};
