import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SupabaseAuthenticationGuard } from '../authentication/supabase-authentication.guard';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(SupabaseAuthenticationGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async listPatientNotes(@Headers('x-user-id') userId: string) {
    const notes = await this.notesService.listPatientNotes(userId);

    return { success: true, data: notes, error: null };
  }

  @Post()
  async createPatientNote(
    @Headers('x-user-id') userId: string,
    @Body() body: Entity.PatientNoteMutationBody,
  ) {
    const note = await this.notesService.createPatientNote(userId, body);

    return note
      ? { success: true, data: note, error: null }
      : { success: false, data: null, error: 'Unable to create note.' };
  }

  @Patch(':noteId')
  async updatePatientNote(
    @Headers('x-user-id') userId: string,
    @Param('noteId') noteId: string,
    @Body() body: Entity.PatientNoteMutationBody,
  ) {
    const note = await this.notesService.updatePatientNote(userId, noteId, body);

    return note
      ? { success: true, data: note, error: null }
      : { success: false, data: null, error: 'Unable to update note.' };
  }

  @Delete(':noteId')
  async deletePatientNote(
    @Headers('x-user-id') userId: string,
    @Param('noteId') noteId: string,
  ) {
    const wasDeleted = await this.notesService.deletePatientNote(userId, noteId);

    return wasDeleted
      ? { success: true, data: null, error: null }
      : { success: false, data: null as null, error: 'Unable to delete note.' };
  }
}
