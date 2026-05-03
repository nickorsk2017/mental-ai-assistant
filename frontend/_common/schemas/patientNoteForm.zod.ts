import { z } from 'zod';

export const patientNoteFormValidationSchema = z.object({
  moodLabel: z.string().trim().min(1, 'Mood label is required.'),
  moodScore: z.number().int().min(1).max(10),
  activityTags: z.array(z.string()).min(1, 'Select at least one tag.'),
  summaryText: z.string().trim().min(1, 'Summary is required.'),
});
