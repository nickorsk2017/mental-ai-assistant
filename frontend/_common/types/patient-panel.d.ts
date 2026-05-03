export {};

declare global {
  namespace Entity {
    type PatientNoteMoodBand = 'euphoria' | 'depression' | 'normal' | 'unknown';

    interface ChatDateContext {
      clientLocalDate?: string;
      clientTimeZone?: string;
    }

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
      summaryText: string;
      createdAt: string;
      updatedAt: string;
    }

    interface PatientNoteMutationInput {
      moodLabel: string | null;
      moodScore: number | null;
      activityTags: string[];
      summaryText: string;
    }

    interface PatientNoteGroup {
      label: string;
      notes: PatientNote[];
    }
  }
}
