import { z } from 'zod';

import { patientChatMinimumMessageLength } from '../constants';

const patientNoteFormSharedFields = {
  moodLabel: z.string().trim().min(1, 'Mood label is required.'),
  moodScore: z.number().int().min(1).max(10),
  activityTags: z.array(z.string()).min(1, 'Select at least one tag.'),
};

/** Editing an existing note: summary may stay short (legacy entries). */
export const patientNoteFormValidationSchema = z.object({
  ...patientNoteFormSharedFields,
  summaryText: z.string().trim().min(1, 'Summary is required.'),
});

/** Creating a new note: minimum length matches AI journal / chat pipeline. */
export const patientNoteFormCreateValidationSchema = z.object({
  ...patientNoteFormSharedFields,
  summaryText: z
    .string()
    .trim()
    .min(
      patientChatMinimumMessageLength,
      `Summary must be at least ${String(patientChatMinimumMessageLength)} characters for AI analysis.`,
    ),
});
