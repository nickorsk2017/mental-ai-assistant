export {};

declare global {
  namespace Entity {
    export interface PatientNoteRecord {
      id: string;
      moodKey: string | null;
      moodLabel: string | null;
      moodScore: number | null;
      activityTags: string[];
      summaryText: string;
      createdAt: string;
      updatedAt: string;
    }

    export interface PatientNoteMutationBody {
      moodLabel?: string | null;
      moodScore?: number | null;
      activityTags?: string[];
      summaryText?: string;
    }
  }
}
