export const patientChatMinimumMessageLength = 50;

export const patientNoteMoodLabels = [
  'depression',
  'normal',
  'euphoria',
  'euphoric',
  'energized',
  'euphoric, energized',
] as const;

export const patientActivityTags = [
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

export const patientPanelMobileTabRoutes = [
  ['/patient-panel/chat', 'Assistant'],
  ['/patient-panel/notes', 'Notes'],
  ['/patient-panel/analysis', 'Analysis'],
] as const;
