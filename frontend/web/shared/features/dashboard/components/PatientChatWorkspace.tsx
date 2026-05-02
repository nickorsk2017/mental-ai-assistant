'use client';

import React from 'react';

import { patientChatMinimumMessageLength } from '../constants/PatientChatConstants';
import { usePatientChatComposer } from '../hooks/usePatientChatComposer';
import PatientChatMessageList from './PatientChatMessageList';

const PatientChatWorkspace = React.memo(function PatientChatWorkspace() {
  const {
    textareaReference,
    messagesEndReference,
    composerText,
    setComposerText,
    messages,
    isStreaming,
    streamingError,
    trimmedComposerLength,
    requiresFirstMessageMinimum,
    canSend,
    handleSend,
    handleComposerKeyDown,
  } = usePatientChatComposer();

  const charactersRemaining = Math.max(0, patientChatMinimumMessageLength - trimmedComposerLength);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-calm-background">
      <header className="flex shrink-0 items-center justify-center border-b border-calm-border/45 px-4 py-3.5 backdrop-blur-sm">
        <h1 className="text-sm font-semibold text-calm-text">Chat</h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-[48rem] flex-col items-center px-4 pt-8 text-center sm:px-8">
            <div className="serene-chat-sphere" aria-hidden />
          </div>

          <div className="sticky my-6 top-0 z-20 px-4 text-center backdrop-blur-xl sm:px-8">
            <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-calm-muted sm:left-8">
              Today
            </div>
            <p className="text-lg font-semibold text-calm-text">How can I help today?</p>
          </div>

          <div className="mx-auto flex max-w-[48rem] flex-col items-center px-4 pb-10 text-center sm:px-8">
            <p className="max-w-md text-sm leading-6 text-calm-muted">
              Describe your mood or something from your day — replies will stream here. Enter sends; Shift+Enter
              starts a new line.
              {requiresFirstMessageMinimum
                ? ` At least ${patientChatMinimumMessageLength} characters are required for the first message.`
                : ''}
            </p>
          </div>

          <PatientChatMessageList
            messages={messages}
            isStreaming={isStreaming}
            messagesEndReference={messagesEndReference}
          />
        </div>

        <div className="shrink-0 border-t border-calm-border/45 bg-calm-surface/85 px-4 py-4 backdrop-blur-md sm:px-6">
          {streamingError && (
            <div className="mx-auto mb-3 max-w-[48rem] rounded-2xl border border-calm-error/35 bg-calm-surface px-4 py-3 text-center text-sm text-calm-error">
              {streamingError}
            </div>
          )}

          <div className="mx-auto flex max-w-[48rem] items-end gap-2 rounded-[28px] border border-calm-border/55 bg-calm-surface px-3 py-2 shadow-subtle">
            <label htmlFor="patient-chat-composer" className="sr-only">
              Message input
            </label>
            <textarea
              ref={textareaReference}
              id="patient-chat-composer"
              rows={1}
              value={composerText}
              onChange={(event) => setComposerText(event.target.value)}
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
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
        </div>
      </div>
    </div>
  );
});

export default PatientChatWorkspace;
