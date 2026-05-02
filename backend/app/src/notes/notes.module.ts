import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../authentication/authentication.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [AuthenticationModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
