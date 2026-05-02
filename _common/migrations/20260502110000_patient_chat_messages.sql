-- Daily chat transcript reloaded by the dashboard and sent to the AI service as context.

create table if not exists public.patient_chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role text not null,
  content text not null,
  created_at timestamptz not null default now(),
  constraint patient_chat_messages_role_check check (role in ('user', 'assistant'))
);

create index if not exists patient_chat_messages_user_id_created_at_idx
  on public.patient_chat_messages (user_id, created_at);

comment on table public.patient_chat_messages is 'Daily patient and assistant chat transcript.';

alter table public.patient_chat_messages enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'patient_chat_messages'
      and policyname = 'patient_chat_messages_select_own'
  ) then
    create policy patient_chat_messages_select_own
      on public.patient_chat_messages
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
      and tablename = 'patient_chat_messages'
      and policyname = 'patient_chat_messages_insert_own'
  ) then
    create policy patient_chat_messages_insert_own
      on public.patient_chat_messages
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end
$$;
