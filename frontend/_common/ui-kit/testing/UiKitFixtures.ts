export const samplePatientNote: Entity.PatientNote = {
  id: 'note-1',
  moodKey: 'normal',
  moodLabel: 'Steady',
  moodScore: 6,
  activityTags: ['work', 'sleep'],
  summaryText: 'A calm day with enough energy to stay focused.',
  createdAt: '2026-05-03T10:30:00.000Z',
  updatedAt: '2026-05-03T10:30:00.000Z',
};

export const samplePatientNotes: Entity.PatientNote[] = [
  samplePatientNote,
  {
    id: 'note-2',
    moodKey: 'euphoria',
    moodLabel: 'Elevated',
    moodScore: 9,
    activityTags: ['relationships'],
    summaryText: 'Lots of energy and social confidence through the evening.',
    createdAt: '2026-05-02T18:00:00.000Z',
    updatedAt: '2026-05-02T18:00:00.000Z',
  },
];

export const sampleChatMessages: Entity.PatientChatMessage[] = [
  {
    id: 'message-1',
    role: 'user',
    content: 'I felt more balanced after a long walk.',
    createdAt: '2026-05-03T10:00:00.000Z',
  },
  {
    id: 'message-2',
    role: 'assistant',
    content: 'That sounds grounding. What helped the most during the walk?',
    createdAt: '2026-05-03T10:01:00.000Z',
  },
];

export const sampleSelectOptions = [
  { label: 'Work', value: 'work' },
  { label: 'Sleep', value: 'sleep' },
  { label: 'Stress', value: 'stress' },
];

export function buildSuccessEnvelope<DataType>(data: DataType): Entity.ApiResponse<DataType> {
  return { success: true, data, error: null };
}
