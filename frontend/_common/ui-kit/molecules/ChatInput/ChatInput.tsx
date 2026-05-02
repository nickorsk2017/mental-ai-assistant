import React from 'react';

import { cx } from '../../../utils';

interface ChatInputProperties {
  textareaReference: React.RefObject<HTMLTextAreaElement | null>;
  inputElementId: string;
  composerText: string;
  setComposerText: React.Dispatch<React.SetStateAction<string>>;
  streamingError: string | null;
  trimmedComposerLength: number;
  requiresFirstMessageMinimum: boolean;
  patientChatMinimumMessageLength: number;
  charactersRemaining: number;
  canSend: boolean;
  handleComposerKeyDown: (keyboardEvent: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void | Promise<void>;
  className?: string;
}

const defaultClassName =
  'mx-auto flex max-w-[48rem] items-end gap-2 rounded-[28px] border border-calm-border/55 bg-calm-surface px-3 py-2 shadow-subtle';
const interactiveClassName =
  'transform-gpu transition-all duration-200 ease-out focus-within:scale-[1.01] focus-within:border-calm-second/60';

const ChatInput = React.memo(function ChatInput({
  textareaReference,
  inputElementId,
  composerText,
  setComposerText,
  streamingError,
  trimmedComposerLength,
  requiresFirstMessageMinimum,
  patientChatMinimumMessageLength,
  charactersRemaining,
  canSend,
  handleComposerKeyDown,
  handleSend,
  className,
}: ChatInputProperties) {

  return (
    <>
      {streamingError && (
        <div className="mx-auto mb-3 max-w-[48rem] rounded-2xl border border-calm-error/35 bg-calm-surface px-4 py-3 text-center text-sm text-calm-error">
          {streamingError}
        </div>
      )}
      <div className={cx(defaultClassName, className, interactiveClassName)}>
        <label htmlFor={inputElementId} className="sr-only">
          Message input
        </label>
        <textarea
          ref={textareaReference}
          id={inputElementId}
          rows={1}
          value={composerText}
          onChange={(changeEvent) => setComposerText(changeEvent.target.value)}
          onKeyDown={handleComposerKeyDown}
          placeholder="Message for Serene…"
          className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-calm-text placeholder:text-calm-muted focus:outline-none"
        />
        <button
          type="button"
          aria-label="Send message"
          className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-calm-second text-calm-primary-text shadow-medium transition hover:brightness-95 disabled:opacity-40"
          disabled={!canSend}
          onClick={() => void handleSend()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.985a.75.75 0 0 0 0-1.228A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
      {requiresFirstMessageMinimum &&
        trimmedComposerLength > 0 &&
        trimmedComposerLength < patientChatMinimumMessageLength && (
        <p className="mx-auto mt-2 max-w-[48rem] text-center text-xs text-calm-muted">
          {charactersRemaining} more characters required for the first message.
        </p>
      )}
    </>
  );
});

export default ChatInput;
