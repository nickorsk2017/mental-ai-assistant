import type { PatientNote } from '../types/PatientNotesTypes';

interface NotesResponse {
  success: boolean;
  data: PatientNote[];
  error: string | null;
}

function resolveBackendBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    'http://localhost:4000'
  );
}

export async function loadPatientNotes(): Promise<PatientNote[]> {
  const response = await fetch(`${resolveBackendBaseUrl()}/notes`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as NotesResponse;

  return payload.success ? payload.data : [];
}
