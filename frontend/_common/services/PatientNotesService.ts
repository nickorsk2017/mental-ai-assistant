import { requestBackend } from '@common/shared/utils';

export async function loadPatientNotes(): Promise<Entity.PatientNote[]> {
  const response = await requestBackend<Entity.PatientNote[]>('/notes', {
    method: 'GET',
  });

  return response.success && response.data !== null ? response.data : [];
}

export async function createPatientNote(
  input: Entity.PatientNoteMutationInput,
): Promise<Entity.ApiResponse<Entity.PatientNote>> {
  return requestBackend<Entity.PatientNote>('/notes', {
    method: 'POST',
    body: input,
  });
}

export async function updatePatientNote(
  noteId: string,
  input: Entity.PatientNoteMutationInput,
): Promise<Entity.ApiResponse<Entity.PatientNote>> {
  return requestBackend<Entity.PatientNote>(`/notes/${noteId}`, {
    method: 'PATCH',
    body: input,
  });
}

export async function deletePatientNote(noteId: string): Promise<Entity.ApiResponse<null>> {
  return requestBackend<null>(`/notes/${noteId}`, {
    method: 'DELETE',
  });
}
