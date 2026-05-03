-- Patient notes keep the human/AI summary only; original journal text is no longer stored.

alter table public.patient_notes
  add column if not exists summary_text text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'patient_notes'
      and column_name = 'message_text'
  ) then
    update public.patient_notes
    set summary_text = coalesce(nullif(btrim(summary_text), ''), message_text, '')
    where summary_text is null
      or btrim(summary_text) = '';
  end if;
end
$$;

update public.patient_notes
set summary_text = ''
where summary_text is null;

alter table public.patient_notes
  alter column summary_text set not null,
  drop column if exists message_text;
