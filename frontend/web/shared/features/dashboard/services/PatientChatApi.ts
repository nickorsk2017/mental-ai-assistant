import type { PatientChatMessage } from '../types/PatientChatTypes';

interface TodayMessagesResponse {
  success: boolean;
  data: PatientChatMessage[];
  error: string | null;
}
interface PatientChatClientDateContext {
  clientLocalDate: string;
  clientTimeZone: string;
}

function resolveBackendBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    'http://localhost:4000'
  );
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

export async function loadTodayPatientChatMessages(): Promise<PatientChatMessage[]> {
  const { clientLocalDate, clientTimeZone } = resolvePatientChatClientDateContext();
  const response = await fetch(`${resolveBackendBaseUrl()}/chat/messages/today`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'x-client-local-date': clientLocalDate,
      'x-client-time-zone': clientTimeZone,
    },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as TodayMessagesResponse;

  return payload.success ? payload.data : [];
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
