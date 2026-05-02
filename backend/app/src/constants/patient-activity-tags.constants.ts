export const PATIENT_ACTIVITY_TAGS = [
  'work',
  'sleep',
  'stress',
  'relationships',
  'fitness',
  'hobbies',
  'health',
  'family',
  'study',
  'finances',
] as const;

export type PatientActivityTag = (typeof PATIENT_ACTIVITY_TAGS)[number];
