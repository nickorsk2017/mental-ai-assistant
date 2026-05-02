import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { SupabaseAuthenticationGuard } from '../authentication/supabase-authentication.guard';
import { buildSuccessResponse } from '../utils/response.builder';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(SupabaseAuthenticationGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async listPatientNotes(@Headers('x-user-id') userId: string) {
    const notes = await this.notesService.listPatientNotes(userId);

    return buildSuccessResponse(notes);
  }
}
