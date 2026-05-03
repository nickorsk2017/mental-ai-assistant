-- Async journal rows written by ai-agents (Kafka consumer) via Supabase service role.
-- Apply with Supabase SQL Editor, `supabase db push`, or your migration runner.

create table if not exists public.patient_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  correlation_id text not null,
  mood_key text,
  mood_label text,
  mood_score smallint,
  activity_tags text[] not null default '{}',
  summary_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint patient_notes_mood_score_range check (
    mood_score is null or mood_score between 1 and 10
  ),
  constraint patient_notes_correlation_id_unique unique (correlation_id)
);

alter table public.patient_notes
  add column if not exists mood_key text,
  add column if not exists mood_label text,
  add column if not exists mood_score smallint,
  add column if not exists activity_tags text[] not null default '{}',
  add column if not exists summary_text text,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists deleted_at timestamptz;

alter table public.patient_notes
  drop column if exists message_text,
  drop column if exists assistant_vibe_check;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'patient_notes_mood_score_range'
  ) then
    alter table public.patient_notes
      drop constraint patient_notes_mood_score_range;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'patient_notes_mood_score_range'
  ) then
    alter table public.patient_notes
      add constraint patient_notes_mood_score_range
      check (mood_score is null or mood_score between 1 and 10);
  end if;
end
$$;


create index if not exists patient_notes_user_id_created_at_idx
  on public.patient_notes (user_id, created_at desc);

create index if not exists patient_notes_user_id_mood_key_idx
  on public.patient_notes (user_id, mood_key);

comment on table public.patient_notes is 'Journal entries queued through Kafka and persisted by the AI agents service.';

create or replace function public.set_patient_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists patient_notes_set_updated_at on public.patient_notes;

create trigger patient_notes_set_updated_at
  before update on public.patient_notes
  for each row
  execute function public.set_patient_notes_updated_at();

alter table public.patient_notes enable row level security;

-- Authenticated users may read only their own rows (service role bypasses RLS for inserts).
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'patient_notes'
      and policyname = 'patient_notes_select_own'
  ) then
    create policy patient_notes_select_own
      on public.patient_notes
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'patient_notes'
      and policyname = 'patient_notes_insert_own'
  ) then
    create policy patient_notes_insert_own
      on public.patient_notes
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'patient_notes'
      and policyname = 'patient_notes_update_own'
  ) then
    create policy patient_notes_update_own
      on public.patient_notes
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'patient_notes'
      and policyname = 'patient_notes_delete_own'
  ) then
    create policy patient_notes_delete_own
      on public.patient_notes
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end
$$;
