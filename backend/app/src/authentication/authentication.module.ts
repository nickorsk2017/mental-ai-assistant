import { Module } from '@nestjs/common';
import { SupabaseModule } from '../providers/supabase/supabase.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { SupabaseAuthenticationGuard } from './supabase-authentication.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, SupabaseAuthenticationGuard],
  exports: [SupabaseAuthenticationGuard],
})
export class AuthenticationModule {}
