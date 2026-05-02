-- Async journal rows written by ai-agents (Kafka consumer) via Supabase service role.
-- Apply with Supabase SQL Editor, `supabase db push`, or your migration runner.

create table if not exists public.patient_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  correlation_id text not null,
  message_text text not null,
  summary_text text,
  created_at timestamptz not null default now(),
  constraint patient_notes_correlation_id_unique unique (correlation_id)
);

create index if not exists patient_notes_user_id_created_at_idx
  on public.patient_notes (user_id, created_at desc);

comment on table public.patient_notes is 'Journal entries queued through Kafka and persisted by the AI agents service.';

alter table public.patient_notes enable row level security;

-- Authenticated users may read only their own rows (service role bypasses RLS for inserts).
create policy patient_notes_select_own
  on public.patient_notes
  for select
  to authenticated
  using (auth.uid() = user_id);
