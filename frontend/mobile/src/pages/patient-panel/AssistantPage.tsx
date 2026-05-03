import React from 'react';
import { IonContent, IonFooter, IonPage, IonToolbar } from '@ionic/react';
import { patientChatMinimumMessageLength } from '@common/shared/constants';
import {
  chatComposerTextareaReference as textareaReference,
  chatMessagesEndReference as messagesEndReference,
  selectChatCanSend,
  selectChatTrimmedComposerLength,
  useChatComposerLifecycle,
  useChatStore,
} from '@common/shared/stores';
import { ChatInput } from '@common/shared/ui-kit';

import { PageHeader } from '../../features/patient-panel/PageHeader';
import MessageList from '../../features/patient-panel/assistant/MessageList';

export function AssistantPage(): React.JSX.Element {
  useChatComposerLifecycle();

  const composerText = useChatStore((state) => state.composerText);
  const setComposerText = useChatStore((state) => state.setComposerText);
  const messages = useChatStore((state) => state.messages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const streamingError = useChatStore((state) => state.streamingError);
  const requiresFirstMessageMinimum = useChatStore((state) => state.requiresFirstMessageMinimum);
  const handleSend = useChatStore((state) => state.sendComposerMessage);
  const handleComposerKeyDown = useChatStore((state) => state.handleComposerKeyDown);
  const trimmedComposerLength = useChatStore(selectChatTrimmedComposerLength);
  const canSend = useChatStore(selectChatCanSend);

  const charactersRemaining = Math.max(
    0,
    patientChatMinimumMessageLength - trimmedComposerLength,
  );

  return (
    <IonPage>
      <PageHeader title="Assistant" />
      <IonContent fullscreen className="bg-calm-background">
        <div className="flex min-h-full flex-col bg-calm-surface">
          <div className="pointer-events-none hidden px-4 py-3 text-sm font-semibold text-calm-muted md:block">
            Today
          </div>
          <div className="flex flex-col items-center px-4 pt-6 text-center">
            <div className="serene-chat-sphere" aria-hidden />
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
        </div>
      </IonContent>
      <IonFooter className="ion-no-border overflow-visible">
        <IonToolbar className="min-h-0 bg-transparent  py-2 [--background:transparent] overflow-visible">
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
