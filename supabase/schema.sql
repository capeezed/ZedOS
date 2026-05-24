create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  status text not null default 'backlog'
    check (status in ('active', 'paused', 'backlog', 'archived')),
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low')),
  area text not null default '',
  stack text[] not null default '{}',
  next_action text not null default '',
  notes_count integer not null default 0 check (notes_count >= 0),
  snippets_count integer not null default 0 check (snippets_count >= 0),
  tasks_count integer not null default 0 check (tasks_count >= 0),
  links_count integer not null default 0 check (links_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_snippets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  title text not null,
  description text not null default '',
  code text not null default '',
  language text not null default 'text',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  title text not null,
  description text not null default '',
  status text not null default 'todo'
    check (status in ('todo', 'doing', 'done')),
  priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  title text not null,
  url text not null,
  description text not null default '',
  category text not null default 'reference',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  description text not null default '',
  project_id uuid references public.projects(id) on delete set null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists project_notes_project_id_created_at_idx
on public.project_notes (project_id, created_at desc);

create index if not exists project_snippets_project_id_created_at_idx
on public.project_snippets (project_id, created_at desc);

create index if not exists project_tasks_project_id_created_at_idx
on public.project_tasks (project_id, created_at desc);

create index if not exists project_tasks_project_id_status_idx
on public.project_tasks (project_id, status);

create index if not exists project_links_project_id_created_at_idx
on public.project_links (project_id, created_at desc);

create index if not exists project_links_project_id_category_idx
on public.project_links (project_id, category);

create index if not exists activity_events_created_at_idx
on public.activity_events (created_at desc);

create index if not exists activity_events_project_id_created_at_idx
on public.activity_events (project_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.refresh_project_notes_count()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_project_id uuid;
begin
  target_project_id = coalesce(new.project_id, old.project_id);

  update public.projects
  set notes_count = (
    select count(*)::integer
    from public.project_notes
    where project_id = target_project_id
  )
  where id = target_project_id;

  return coalesce(new, old);
end;
$$;

create or replace function public.refresh_project_snippets_count()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_project_id uuid;
begin
  target_project_id = coalesce(new.project_id, old.project_id);

  update public.projects
  set snippets_count = (
    select count(*)::integer
    from public.project_snippets
    where project_id = target_project_id
  )
  where id = target_project_id;

  return coalesce(new, old);
end;
$$;

create or replace function public.refresh_project_tasks_count()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_project_id uuid;
begin
  target_project_id = coalesce(new.project_id, old.project_id);

  update public.projects
  set tasks_count = (
    select count(*)::integer
    from public.project_tasks
    where project_id = target_project_id
  )
  where id = target_project_id;

  return coalesce(new, old);
end;
$$;

create or replace function public.refresh_project_links_count()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_project_id uuid;
begin
  target_project_id = coalesce(new.project_id, old.project_id);

  update public.projects
  set links_count = (
    select count(*)::integer
    from public.project_links
    where project_id = target_project_id
  )
  where id = target_project_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
drop trigger if exists project_notes_set_updated_at on public.project_notes;
drop trigger if exists project_notes_refresh_count_insert on public.project_notes;
drop trigger if exists project_notes_refresh_count_delete on public.project_notes;
drop trigger if exists project_snippets_set_updated_at on public.project_snippets;
drop trigger if exists project_snippets_refresh_count_insert on public.project_snippets;
drop trigger if exists project_snippets_refresh_count_delete on public.project_snippets;
drop trigger if exists project_tasks_set_updated_at on public.project_tasks;
drop trigger if exists project_tasks_refresh_count_insert on public.project_tasks;
drop trigger if exists project_tasks_refresh_count_delete on public.project_tasks;
drop trigger if exists project_links_set_updated_at on public.project_links;
drop trigger if exists project_links_refresh_count_insert on public.project_links;
drop trigger if exists project_links_refresh_count_delete on public.project_links;

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create trigger project_notes_set_updated_at
before update on public.project_notes
for each row
execute function public.set_updated_at();

create trigger project_notes_refresh_count_insert
after insert on public.project_notes
for each row
execute function public.refresh_project_notes_count();

create trigger project_notes_refresh_count_delete
after delete on public.project_notes
for each row
execute function public.refresh_project_notes_count();

create trigger project_snippets_set_updated_at
before update on public.project_snippets
for each row
execute function public.set_updated_at();

create trigger project_snippets_refresh_count_insert
after insert on public.project_snippets
for each row
execute function public.refresh_project_snippets_count();

create trigger project_snippets_refresh_count_delete
after delete on public.project_snippets
for each row
execute function public.refresh_project_snippets_count();

create trigger project_tasks_set_updated_at
before update on public.project_tasks
for each row
execute function public.set_updated_at();

create trigger project_tasks_refresh_count_insert
after insert on public.project_tasks
for each row
execute function public.refresh_project_tasks_count();

create trigger project_tasks_refresh_count_delete
after delete on public.project_tasks
for each row
execute function public.refresh_project_tasks_count();

create trigger project_links_set_updated_at
before update on public.project_links
for each row
execute function public.set_updated_at();

create trigger project_links_refresh_count_insert
after insert on public.project_links
for each row
execute function public.refresh_project_links_count();

create trigger project_links_refresh_count_delete
after delete on public.project_links
for each row
execute function public.refresh_project_links_count();

alter table public.projects enable row level security;
alter table public.project_notes enable row level security;
alter table public.project_snippets enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_links enable row level security;
alter table public.activity_events enable row level security;

grant select, insert, update, delete on table public.projects to anon, authenticated;
grant select, insert, update, delete on table public.project_notes to anon, authenticated;
grant select, insert, update, delete on table public.project_snippets to anon, authenticated;
grant select, insert, update, delete on table public.project_tasks to anon, authenticated;
grant select, insert, update, delete on table public.project_links to anon, authenticated;
grant select, insert, update, delete on table public.activity_events to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

drop policy if exists "Allow project reads" on public.projects;
drop policy if exists "Allow project inserts" on public.projects;
drop policy if exists "Allow project updates" on public.projects;
drop policy if exists "Allow project deletes" on public.projects;
drop policy if exists "Allow project note reads" on public.project_notes;
drop policy if exists "Allow project note inserts" on public.project_notes;
drop policy if exists "Allow project note updates" on public.project_notes;
drop policy if exists "Allow project note deletes" on public.project_notes;
drop policy if exists "Allow project snippet reads" on public.project_snippets;
drop policy if exists "Allow project snippet inserts" on public.project_snippets;
drop policy if exists "Allow project snippet updates" on public.project_snippets;
drop policy if exists "Allow project snippet deletes" on public.project_snippets;
drop policy if exists "Allow project task reads" on public.project_tasks;
drop policy if exists "Allow project task inserts" on public.project_tasks;
drop policy if exists "Allow project task updates" on public.project_tasks;
drop policy if exists "Allow project task deletes" on public.project_tasks;
drop policy if exists "Allow project link reads" on public.project_links;
drop policy if exists "Allow project link inserts" on public.project_links;
drop policy if exists "Allow project link updates" on public.project_links;
drop policy if exists "Allow project link deletes" on public.project_links;
drop policy if exists "Allow activity reads" on public.activity_events;
drop policy if exists "Allow activity inserts" on public.activity_events;
drop policy if exists "Allow activity updates" on public.activity_events;
drop policy if exists "Allow activity deletes" on public.activity_events;

create policy "Allow project reads"
on public.projects
for select
to anon, authenticated
using (true);

create policy "Allow project inserts"
on public.projects
for insert
to anon, authenticated
with check (true);

create policy "Allow project updates"
on public.projects
for update
to anon, authenticated
using (true)
with check (true);

create policy "Allow project deletes"
on public.projects
for delete
to anon, authenticated
using (true);

create policy "Allow project note reads"
on public.project_notes
for select
to anon, authenticated
using (true);

create policy "Allow project note inserts"
on public.project_notes
for insert
to anon, authenticated
with check (true);

create policy "Allow project note updates"
on public.project_notes
for update
to anon, authenticated
using (true)
with check (true);

create policy "Allow project note deletes"
on public.project_notes
for delete
to anon, authenticated
using (true);

create policy "Allow project snippet reads"
on public.project_snippets
for select
to anon, authenticated
using (true);

create policy "Allow project snippet inserts"
on public.project_snippets
for insert
to anon, authenticated
with check (true);

create policy "Allow project snippet updates"
on public.project_snippets
for update
to anon, authenticated
using (true)
with check (true);

create policy "Allow project snippet deletes"
on public.project_snippets
for delete
to anon, authenticated
using (true);

create policy "Allow project task reads"
on public.project_tasks
for select
to anon, authenticated
using (true);

create policy "Allow project task inserts"
on public.project_tasks
for insert
to anon, authenticated
with check (true);

create policy "Allow project task updates"
on public.project_tasks
for update
to anon, authenticated
using (true)
with check (true);

create policy "Allow project task deletes"
on public.project_tasks
for delete
to anon, authenticated
using (true);

create policy "Allow project link reads"
on public.project_links
for select
to anon, authenticated
using (true);

create policy "Allow project link inserts"
on public.project_links
for insert
to anon, authenticated
with check (true);

create policy "Allow project link updates"
on public.project_links
for update
to anon, authenticated
using (true)
with check (true);

create policy "Allow project link deletes"
on public.project_links
for delete
to anon, authenticated
using (true);

create policy "Allow activity reads"
on public.activity_events
for select
to anon, authenticated
using (true);

create policy "Allow activity inserts"
on public.activity_events
for insert
to anon, authenticated
with check (true);

create policy "Allow activity updates"
on public.activity_events
for update
to anon, authenticated
using (true)
with check (true);

create policy "Allow activity deletes"
on public.activity_events
for delete
to anon, authenticated
using (true);

insert into public.projects (
  slug,
  name,
  description,
  status,
  priority,
  area,
  stack,
    next_action,
    notes_count,
    snippets_count,
    tasks_count,
    links_count
) values
  (
    'zedos',
    'ZedOS',
    'Developer OS pessoal para centralizar workflow, memoria tecnica e automacoes.',
    'active',
    'high',
    'Productivity',
    array['React', 'TypeScript', 'Tailwind', 'Supabase'],
    'Conectar CRUD inicial de projetos ao Supabase.',
    4,
    6,
    0,
    0
  ),
  (
    'api-lab',
    'API Lab',
    'Ambiente de experimentos para padroes Node, Express, Prisma e PostgreSQL.',
    'backlog',
    'medium',
    'Backend',
    array['Node.js', 'Express', 'Prisma'],
    'Definir estrutura futura de services e repositories.',
    2,
    5,
    0,
    0
  ),
  (
    'ui-system',
    'UI System',
    'Biblioteca visual local baseada em shadcn/ui para telas densas e produtivas.',
    'active',
    'medium',
    'Frontend',
    array['shadcn/ui', 'Radix', 'Lucide'],
    'Criar padroes de cards, listas e paineis.',
    3,
    7,
    0,
    0
  )
on conflict (slug) do nothing;

update public.projects p
set notes_count = counts.notes_count,
    snippets_count = counts.snippets_count,
    tasks_count = counts.tasks_count,
    links_count = counts.links_count
from (
  select
    p.id,
    (select count(*)::integer from public.project_notes n where n.project_id = p.id) as notes_count,
    (select count(*)::integer from public.project_snippets s where s.project_id = p.id) as snippets_count,
    (select count(*)::integer from public.project_tasks t where t.project_id = p.id) as tasks_count,
    (select count(*)::integer from public.project_links l where l.project_id = p.id) as links_count
  from public.projects p
) counts
where p.id = counts.id;
