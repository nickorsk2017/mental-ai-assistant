import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../providers';
import type { PatientNoteRecord } from './notes.types';

interface PatientNoteRow {
  id: string;
  mood_key: string | null;
  mood_label: string | null;
  mood_score: number | null;
  activity_tags: string[] | null;
  message_text: string;
  summary_text: string | null;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async listPatientNotes(userId: string): Promise<PatientNoteRecord[]> {
    const { data, error } = await this.supabaseService.adminClient
      .from('patient_notes')
      .select(
        [
          'id',
          'mood_key',
          'mood_label',
          'mood_score',
          'activity_tags',
          'message_text',
          'summary_text',
          'created_at',
          'updated_at',
        ].join(', '),
      )
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.warn(`Failed to load patient notes: ${error.message}`);

      return [];
    }

    return ((data ?? []) as unknown as PatientNoteRow[]).map((note) => ({
      id: note.id,
      moodKey: note.mood_key,
      moodLabel: note.mood_label,
      moodScore: note.mood_score,
      activityTags: note.activity_tags ?? [],
      messageText: note.message_text,
      summaryText: note.summary_text,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    }));
  }
}
