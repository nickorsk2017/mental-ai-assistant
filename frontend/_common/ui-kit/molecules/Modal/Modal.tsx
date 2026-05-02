'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Button from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { cx } from '../../../utils';

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  formId?: string;
  className?: string;
  bodyClassName?: string;
  closeLabel?: string;
};

export default React.memo(function Modal({
  isOpen,
  title,
  children,
  footer,
  onClose,
  formId,
  className,
  bodyClassName,
  closeLabel = 'Close modal',
}: ModalProps) {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !portalElement) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex h-dvh w-screen items-center justify-center bg-calm-text/25 px-4 py-6 backdrop-blur-sm">
      <section
        aria-modal="true"
        role="dialog"
        aria-labelledby={formId ? `${formId}-title` : undefined}
        className={cx(
          'flex max-h-full w-full max-w-[42rem] flex-col overflow-hidden rounded-lg border border-calm-border bg-calm-surface shadow-medium',
          className,
        )}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-calm-border/60 px-6 py-4">
          <h2 id={formId ? `${formId}-title` : undefined} className="text-base font-semibold text-calm-text">
            {title}
          </h2>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            wide={false}
            rounded
            size="small"
            className="!h-10 !w-10 !min-h-0 !p-0"
            aria-label={closeLabel}
          >
            <Icon name="x" size={18} color="currentColor" />
          </Button>
        </header>

        <div className={cx('min-h-0 flex-1 overflow-y-auto px-6 py-5', bodyClassName)}>
          {children}
        </div>

        {footer ? (
          <footer className="shrink-0 border-t border-calm-border/60 px-6 py-4">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>,
    portalElement,
  );
});
