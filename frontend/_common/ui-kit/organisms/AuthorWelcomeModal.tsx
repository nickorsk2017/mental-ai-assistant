'use client';

import React, { useEffect, useMemo, useState } from 'react';

import Button from '../atoms/Button/Button';
import Modal from '../molecules/Modal/Modal';

interface AuthorWelcomeModalProps {
  userId: string | null;
}

const linkedInUrl = 'https://www.linkedin.com/in/nickot/';

const AuthorWelcomeModal = React.memo(function AuthorWelcomeModal({
  userId,
}: AuthorWelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const storageKey = useMemo(() => {
    if (!userId) {
      return null;
    }

    return `mental-health-author-welcome:${userId}`;
  }, [userId]);

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') {
      return;
    }

    if (window.localStorage.getItem(storageKey) === 'seen') {
      return;
    }

    setIsOpen(true);
  }, [storageKey]);

  const handleClose = () => {
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, 'seen');
    }

    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Welcome"
      onClose={handleClose}
      footer={
        <div className="flex justify-end">
          <Button type="button" variant="black" wide={false} onClick={handleClose}>
            Continue
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-sm leading-7 text-calm-text">
        <div>
          <p className="font-semibold">Author: Nikolai Stepanov</p>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noreferrer"
            className="text-calm-primary underline decoration-calm-primary/50 underline-offset-4"
          >
            LinkedIn
          </a>
        </div>
        <p>This demo showcases my development skills.</p>
        <p>
          I offer services as an AI Full-Stack Developer (AI + Web + Mobile) and have 14 years
          of experience in this field.
        </p>
        <p>I am open to commercial opportunities. Feel free to contact me on LinkedIn.</p>
      </div>
    </Modal>
  );
});

export default AuthorWelcomeModal;
