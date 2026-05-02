import { requestBackend } from '@common/shared/utils';

interface PatientChatClientDateContext {
  clientLocalDate: string;
  clientTimeZone: string;
}

function resolvePatientChatClientDateContext(): PatientChatClientDateContext {
  const currentDate = new Date();
  const clientLocalDate = [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, '0'),
    String(currentDate.getDate()).padStart(2, '0'),
  ].join('-');
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  return { clientLocalDate, clientTimeZone };
}

function resolveBackendBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.BACKEND_URL ?? 'http://localhost:4000'
  );
}

export async function loadTodayPatientChatMessages(): Promise<Entity.PatientChatMessage[]> {
  const { clientLocalDate, clientTimeZone } = resolvePatientChatClientDateContext();

  const response = await requestBackend<Entity.PatientChatMessage[]>('/chat/messages/today', {
    method: 'GET',
    headers: {
      'x-client-local-date': clientLocalDate,
      'x-client-time-zone': clientTimeZone,
    },
  });

  return response.success ? response.data : [];
}

export function openPatientChatStream(
  messageText: string,
  enforceMinimumLength: boolean,
): Promise<Response> {
  const clientDateContext = resolvePatientChatClientDateContext();

  return fetch(`${resolveBackendBaseUrl()}/chat/messages/stream`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageText, enforceMinimumLength, ...clientDateContext }),
  });
}
