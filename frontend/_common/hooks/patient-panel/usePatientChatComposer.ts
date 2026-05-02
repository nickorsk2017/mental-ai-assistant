'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { patientChatMinimumMessageLength } from '@common/shared/constants';
import {
  loadTodayPatientChatMessages,
  openPatientChatStream,
} from '@common/shared/services';

const patientChatFirstMessageStorageKey = 'serenePatientChatHasSentFirstMessage';

export function usePatientChatComposer() {
  const textareaReference = useRef<HTMLTextAreaElement>(null);
  const messagesEndReference = useRef<HTMLDivElement>(null);
  const hasLoadedInitialMessagesReference = useRef(false);
  const hasAppliedInitialScrollReference = useRef(false);

  const [composerText, setComposerText] = useState('');
  const [messages, setMessages] = useState<Entity.PatientChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingError, setStreamingError] = useState<string | null>(null);
  const [requiresFirstMessageMinimum, setRequiresFirstMessageMinimum] = useState(true);

  useEffect(() => {
    setRequiresFirstMessageMinimum(
      window.localStorage.getItem(patientChatFirstMessageStorageKey) !== 'true',
    );
  }, []);

  useEffect(() => {
    let isMounted = true;

    void loadTodayPatientChatMessages().then((todayMessages) => {
      if (isMounted) {
        setMessages(todayMessages);
        hasLoadedInitialMessagesReference.current = true;
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isStreaming) {
      textareaReference.current?.focus();
    }
  }, [isStreaming]);

  useEffect(() => {
    const shouldUseAutoScroll =
      hasLoadedInitialMessagesReference.current && !hasAppliedInitialScrollReference.current;
    const scrollBehavior: ScrollBehavior = shouldUseAutoScroll ? 'auto' : 'smooth';

    messagesEndReference.current?.scrollIntoView({ behavior: scrollBehavior });

    if (shouldUseAutoScroll) {
      hasAppliedInitialScrollReference.current = true;
    }
  }, [messages]);

  const trimmedComposerLength = composerText.trim().length;

  const meetsMinimumLength =
    !requiresFirstMessageMinimum ||
    trimmedComposerLength >= patientChatMinimumMessageLength;

  const canSend = trimmedComposerLength > 0 && meetsMinimumLength && !isStreaming;

  const handleSend = useCallback(async () => {
    const trimmed = composerText.trim();

    if (trimmed.length === 0 || isStreaming) {
      return;
    }

    if (
      requiresFirstMessageMinimum &&
      trimmed.length < patientChatMinimumMessageLength
    ) {
      return;
    }

    setStreamingError(null);
    setComposerText('');

    setMessages((previousMessages: Entity.PatientChatMessage[]) => [
      ...previousMessages,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: '' },
    ]);

    setIsStreaming(true);

    try {
      const response = await openPatientChatStream(trimmed, requiresFirstMessageMinimum);

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as { error?: string } | null;

        throw new Error(errorPayload?.error ?? `Request failed (${response.status}).`);
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error('Streaming body is not available.');
      }

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        accumulated += decoder.decode(value, { stream: true });

        setMessages((previousMessages: Entity.PatientChatMessage[]) => {
          const next = [...previousMessages];
          const lastIndex = next.length - 1;

          if (lastIndex >= 0 && next[lastIndex].role === 'assistant') {
            next[lastIndex] = { role: 'assistant', content: accumulated };
          }

          return next;
        });
      }

      const remainingText = decoder.decode();

      if (remainingText) {
        accumulated += remainingText;
        setMessages((previousMessages: Entity.PatientChatMessage[]) => {
          const next = [...previousMessages];
          const lastIndex = next.length - 1;

          if (lastIndex >= 0 && next[lastIndex].role === 'assistant') {
            next[lastIndex] = { role: 'assistant', content: accumulated };
          }

          return next;
        });
      }

      window.localStorage.setItem(patientChatFirstMessageStorageKey, 'true');
      setRequiresFirstMessageMinimum(false);
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : 'Unable to complete the request.';

      setStreamingError(messageText);
      setComposerText(trimmed);
      setMessages((previousMessages: Entity.PatientChatMessage[]) => {
        if (previousMessages.length < 2) {
          return previousMessages;
        }

        return previousMessages.slice(0, -2);
      });
    } finally {
      setIsStreaming(false);
    }
  }, [composerText, isStreaming, requiresFirstMessageMinimum]);

  const handleComposerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  return {
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
  };
}
