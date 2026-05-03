'use client';

import React from 'react';

import Button from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';

type PanelPageHeaderProperties =
  | {
      title: string;
      onPrimaryAction: () => void;
      primaryActionAriaLabel: string;
    }
  | {
      title: string;
    };

export default React.memo(function PanelPageHeader(properties: PanelPageHeaderProperties) {
  return (
    <header className="flex shrink-0 items-center justify-between min-h-[73px] border-b border-calm-border/45 px-6 py-4 backdrop-blur-sm">
      <h1 className="text-base font-semibold text-calm-text">{properties.title}</h1>
      {'onPrimaryAction' in properties ? (
        <Button
          type="button"
          onClick={properties.onPrimaryAction}
          wide={false}
          rounded
          className="!h-10 !w-10 !min-h-0 !p-0 shadow-subtle hover:shadow-medium"
          aria-label={properties.primaryActionAriaLabel}
        >
          <Icon name="plus" size={18} color="currentColor" />
        </Button>
      ) : null}
    </header>
  );
});
