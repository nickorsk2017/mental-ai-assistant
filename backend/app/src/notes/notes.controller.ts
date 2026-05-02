import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SupabaseAuthenticationGuard } from '../authentication/supabase-authentication.guard';
import { buildErrorResponse, buildSuccessResponse } from '../utils/response.builder';
import { NotesService } from './notes.service';
import type { PatientNoteMutationBody } from './notes.types';

@Controller('notes')
@UseGuards(SupabaseAuthenticationGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async listPatientNotes(@Headers('x-user-id') userId: string) {
    const notes = await this.notesService.listPatientNotes(userId);

    return buildSuccessResponse(notes);
  }

  @Post()
  async createPatientNote(
    @Headers('x-user-id') userId: string,
    @Body() body: PatientNoteMutationBody,
  ) {
    const note = await this.notesService.createPatientNote(userId, body);

    return note
      ? buildSuccessResponse(note)
      : buildErrorResponse('Unable to create note.');
  }

  @Patch(':noteId')
  async updatePatientNote(
    @Headers('x-user-id') userId: string,
    @Param('noteId') noteId: string,
    @Body() body: PatientNoteMutationBody,
  ) {
    const note = await this.notesService.updatePatientNote(userId, noteId, body);

    return note
      ? buildSuccessResponse(note)
      : buildErrorResponse('Unable to update note.');
  }

  @Delete(':noteId')
  async deletePatientNote(
    @Headers('x-user-id') userId: string,
    @Param('noteId') noteId: string,
  ) {
    const wasDeleted = await this.notesService.deletePatientNote(userId, noteId);

    return wasDeleted
      ? buildSuccessResponse(null)
      : buildErrorResponse('Unable to delete note.');
  }
}
