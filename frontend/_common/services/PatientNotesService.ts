import { requestBackend } from '@common/shared/utils';

export async function loadPatientNotes(): Promise<Entity.PatientNote[]> {
  const response = await requestBackend<Entity.PatientNote[]>('/notes', {
    method: 'GET',
  });

  return response.success ? response.data : [];
}
