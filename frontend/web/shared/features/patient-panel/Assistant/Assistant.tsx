'use client';

import React from 'react';

import { patientChatMinimumMessageLength } from '@common/shared/constants';
import { usePatientChatComposer } from '@common/shared/hooks';
import { ChatInput, LoadingSpinner } from '@common/shared/ui-kit';
import MessageList from './components/MessageList/MessageList';

const ChatInitialPreloader = React.memo(function ChatInitialPreloader() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="rounded-lg border border-calm-border/70 bg-calm-surface px-5 py-4 shadow-subtle">
        <LoadingSpinner size="medium" label="Loading messages..." />
      </div>
    </div>
  );
});

const PatientChatWorkspace = React.memo(function PatientChatWorkspace() {
  const {
    textareaReference,
    messagesEndReference,
    composerText,
    setComposerText,
    messages,
    isLoadingInitialMessages,
    isStreaming,
    streamingError,
    trimmedComposerLength,
    requiresFirstMessageMinimum,
    canSend,
    handleSend,
    handleComposerKeyDown,
  } = usePatientChatComposer();

  const charactersRemaining = Math.max(
    0,
    patientChatMinimumMessageLength - trimmedComposerLength,
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-calm-surface">
      <header className="flex shrink-0 items-center justify-center border-b border-calm-border/45 px-4 py-3.5 backdrop-blur-sm">
        <h1 className="text-sm font-semibold text-calm-text">Chat</h1>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="relative min-h-0 flex-1 overflow-y-auto">
          {isLoadingInitialMessages ? (
            <ChatInitialPreloader />
          ) : (
            <div className="animate-chat-messages-appear">
              <div className="sticky top-0 z-21 hidden py-4 pl-4 text-sm font-semibold text-calm-muted pointer-events-none md:block">
                Today
              </div>

              <div className="mx-auto flex max-w-[48rem] flex-col items-center px-4 pt-8 text-center sm:px-8">
                <div className="serene-chat-sphere" aria-hidden />
              </div>

              <div className="sticky top-0 z-20 my-6 bg-white/20 px-4 text-center text-lg font-semibold text-calm-text backdrop-blur-xl sm:px-8">
                How can I help today?
              </div>

              <div className="mx-auto flex max-w-[48rem] flex-col items-center px-4 pb-10 text-center sm:px-8">
                <p className="max-w-md text-sm leading-6 text-calm-muted">
                  Describe your mood or something from your day — replies will stream here. Enter sends;
                  Shift+Enter starts a new line.
                  {requiresFirstMessageMinimum
                    ? ` At least ${patientChatMinimumMessageLength} characters are required for the first message.`
                    : ''}
                </p>
              </div>

              <MessageList
                messages={messages}
                isStreaming={isStreaming}
                messagesEndReference={messagesEndReference}
              />
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-calm-border/45 bg-calm-surface/85 px-4 py-4 backdrop-blur-md sm:px-6">
          <ChatInput
            textareaReference={textareaReference}
            inputElementId="patient-chat-composer"
            composerText={composerText}
            setComposerText={setComposerText}
            streamingError={streamingError}
            trimmedComposerLength={trimmedComposerLength}
            requiresFirstMessageMinimum={requiresFirstMessageMinimum}
            patientChatMinimumMessageLength={patientChatMinimumMessageLength}
            charactersRemaining={charactersRemaining}
            canSend={canSend}
            handleComposerKeyDown={handleComposerKeyDown}
            handleSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
});

export default PatientChatWorkspace;
