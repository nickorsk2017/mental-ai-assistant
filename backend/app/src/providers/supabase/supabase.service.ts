import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly publicClient: SupabaseClient;
  private readonly serviceClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
    const publishableKey = this.configService.get<string>('SUPABASE_PUBLISHABLE_KEY');
    const secretKey = this.configService.get<string>('SUPABASE_SECRET_KEY');

    this.publicClient = createClient(supabaseUrl, publishableKey!);
    this.serviceClient = createClient(supabaseUrl, secretKey!);
  }

  get authClient(): SupabaseClient {
    return this.publicClient;
  }

  get adminClient(): SupabaseClient {
    return this.serviceClient;
  }
}
