export interface PatientNoteRecord {
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
