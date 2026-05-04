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

    /** API row shape returned from the notes service (Nest). */
    interface PatientNoteRecord {
      id: string;
      moodKey: string | null;
      moodLabel: string | null;
      moodScore: number | null;
      activityTags: string[];
      summaryText: string;
      createdAt: string;
      updatedAt: string;
    }

    /** Request body for create / update note (Nest). */
    interface PatientNoteMutationBody {
      moodLabel?: string | null;
      moodScore?: number | null;
      activityTags?: string[];
      summaryText?: string;
    }
  }
}
