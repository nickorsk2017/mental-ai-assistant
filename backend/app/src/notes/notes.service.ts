import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SupabaseService } from '../providers';

interface PatientNoteRow {
  id: string;
  mood_key: string | null;
  mood_label: string | null;
  mood_score: number | null;
  activity_tags: string[] | null;
  summary_text: string;
  created_at: string;
  updated_at: string;
}

const patientNoteSelectColumns = [
  'id',
  'mood_key',
  'mood_label',
  'mood_score',
  'activity_tags',
  'summary_text',
  'created_at',
  'updated_at',
].join(', ');

function normalizeActivityTags(activityTags: string[] | undefined): string[] {
  return Array.from(
    new Set((activityTags ?? []).map((tag) => tag.trim()).filter(Boolean)),
  );
}

function mapPatientNoteRow(note: PatientNoteRow): Entity.PatientNoteRecord {
  return {
    id: note.id,
    moodKey: note.mood_key,
    moodLabel: note.mood_label,
    moodScore: note.mood_score,
    activityTags: note.activity_tags ?? [],
    summaryText: note.summary_text,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
  };
}

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async listPatientNotes(userId: string): Promise<Entity.PatientNoteRecord[]> {
    const { data, error } = await this.supabaseService.adminClient
      .from('patient_notes')
      .select(patientNoteSelectColumns)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.warn(`Failed to load patient notes: ${error.message}`);

      return [];
    }

    return ((data ?? []) as unknown as PatientNoteRow[]).map(mapPatientNoteRow);
  }

  async createPatientNote(
    userId: string,
    body: Entity.PatientNoteMutationBody,
  ): Promise<Entity.PatientNoteRecord | null> {
    const summaryText = body.summaryText?.trim() ?? '';

    if (!summaryText) {
      return null;
    }

    const { data, error } = await this.supabaseService.adminClient
      .from('patient_notes')
      .insert({
        user_id: userId,
        correlation_id: `manual-${randomUUID()}`,
        mood_key: null,
        mood_label: body.moodLabel?.trim() || null,
        mood_score: body.moodScore ?? null,
        activity_tags: normalizeActivityTags(body.activityTags),
        summary_text: summaryText,
      })
      .select(patientNoteSelectColumns)
      .single();

    if (error) {
      this.logger.warn(`Failed to create patient note: ${error.message}`);

      return null;
    }

    return mapPatientNoteRow(data as unknown as PatientNoteRow);
  }

  async updatePatientNote(
    userId: string,
    noteId: string,
    body: Entity.PatientNoteMutationBody,
  ): Promise<Entity.PatientNoteRecord | null> {
    const summaryText = body.summaryText?.trim() ?? '';

    if (!summaryText) {
      return null;
    }

    const { data, error } = await this.supabaseService.adminClient
      .from('patient_notes')
      .update({
        mood_label: body.moodLabel?.trim() || null,
        mood_score: body.moodScore ?? null,
        activity_tags: normalizeActivityTags(body.activityTags),
        summary_text: summaryText,
      })
      .eq('id', noteId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select(patientNoteSelectColumns)
      .single();

    if (error) {
      this.logger.warn(`Failed to update patient note: ${error.message}`);

      return null;
    }

    return mapPatientNoteRow(data as unknown as PatientNoteRow);
  }

  async deletePatientNote(userId: string, noteId: string): Promise<boolean> {
    const { error } = await this.supabaseService.adminClient
      .from('patient_notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', noteId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select('id')
      .single();

    if (error) {
      this.logger.warn(`Failed to delete patient note: ${error.message}`);

      return false;
    }

    return true;
  }
}
