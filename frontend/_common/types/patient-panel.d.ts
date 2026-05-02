export {};

declare global {
  namespace Entity {
    type PatientNoteMoodBand = 'euphoria' | 'depression' | 'normal' | 'unknown';

    interface PatientChatMessage {
      id?: string;
      role: 'user' | 'assistant';
      content: string;
      createdAt?: string;
    }

    interface PatientNote {
      id: string;
      moodKey: string | null;
      moodLabel: string | null;
      moodScore: number | null;
      activityTags: string[];
      messageText: string;
      summaryText: string | null;
      createdAt: string;
      updatedAt: string;
    }

    interface PatientNoteGroup {
      label: string;
      notes: PatientNote[];
    }
  }
}
