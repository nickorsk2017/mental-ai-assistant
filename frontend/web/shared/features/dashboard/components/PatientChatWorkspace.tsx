'use client';

import React from 'react';

const PatientChatWorkspace = React.memo(function PatientChatWorkspace() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-calm-background">
      <header className="flex shrink-0 items-center justify-center border-b border-calm-border/45 px-4 py-3.5 backdrop-blur-sm">
        <h1 className="text-sm font-semibold text-calm-text">Chat</h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-10 sm:px-8">
          <div className="mx-auto flex max-w-[48rem] flex-col items-center justify-center pt-8 text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-calm-border/60 bg-calm-surface/80 shadow-subtle">
              <span className="text-2xl font-semibold text-calm-second" aria-hidden>
                S
              </span>
            </div>
            <p className="max-w-md text-lg font-semibold text-calm-text">How can I help today?</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-calm-muted">
              Describe your mood or something from your day — replies will appear here. This layout follows a calm,
              familiar chat-style conversation.
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-calm-border/45 bg-calm-surface/85 px-4 py-4 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-[48rem] items-end gap-2 rounded-[28px] border border-calm-border/55 bg-calm-surface px-3 py-2 shadow-subtle">
            <label htmlFor="patient-chat-composer" className="sr-only">
              Message input
            </label>
            <textarea
              id="patient-chat-composer"
              rows={1}
              readOnly
              placeholder="Message for Serene…"
              className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-calm-text placeholder:text-calm-muted focus:outline-none"
            />
            <button
              type="button"
              aria-label="Send message"
              className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-calm-second text-calm-primary-text shadow-medium transition hover:brightness-95 disabled:opacity-40"
              disabled
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.985.75.75 0 0 0 0-1.228A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-[48rem] text-center text-xs text-calm-muted">
            Layout demonstration — sending is currently disabled.
          </p>
        </div>
      </div>
    </div>
  );
});

export default PatientChatWorkspace;
