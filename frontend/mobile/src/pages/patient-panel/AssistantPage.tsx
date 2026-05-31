import React from 'react';
import { IonContent, IonFooter, IonPage, IonToolbar } from '@ionic/react';
import { patientChatMinimumMessageLength } from '@common/shared/constants';
import { usePatientChatComposer } from '@common/shared/hooks';
import { ChatInput, LoadingSpinner } from '@common/shared/ui-kit';

import { PageHeader } from '../../features/patient-panel/PageHeader';
import MessageList from '../../features/patient-panel/assistant/MessageList';

export function AssistantPage(): React.JSX.Element {
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
    <IonPage>
      <PageHeader title="Assistant" />
      <IonContent fullscreen className="bg-calm-background">
        <div className="flex min-h-full flex-col bg-calm-surface">
          {isLoadingInitialMessages ? (
            <div className="flex min-h-full items-center justify-center px-4 py-16">
              <div className="rounded-lg border border-calm-border/70 bg-calm-surface px-5 py-4 shadow-subtle">
                <LoadingSpinner size="medium" label="Loading messages..." />
              </div>
            </div>
          ) : (
            <>
              <div className="pointer-events-none hidden px-4 py-3 text-sm font-semibold text-calm-muted md:block">
                Today
              </div>
              <div className="flex flex-col items-center px-4 pt-6 text-center">
                <div className="assistant-chat-sphere" aria-hidden />
                <h2 className="mt-4 text-lg font-semibold text-calm-text">How can I help today?</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-calm-muted">
                  Describe your mood or something from your day — replies will stream here. Enter sends; Shift+Enter
                  starts a new line.
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
            </>
          )}
        </div>
      </IonContent>
      <IonFooter className="ion-no-border overflow-visible">
        <IonToolbar className="min-h-0 py-4 [--background:transparent] overflow-visible">
          <ChatInput
            textareaReference={textareaReference}
            inputElementId="patient-chat-composer-mobile"
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
            className="w-[95%]"
          />
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
