-- Store note activity tags as a native Postgres text array.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'patient_notes'
      and column_name = 'activity_tags'
      and data_type <> 'ARRAY'
  ) then
    alter table public.patient_notes
      alter column activity_tags drop default;

    alter table public.patient_notes
      alter column activity_tags type text[]
      using case
        when coalesce(activity_tags, '') = '' then '{}'::text[]
        else string_to_array(activity_tags, ',')
      end;
  end if;

  alter table public.patient_notes
    alter column activity_tags set default '{}';
end
$$;
