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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
drop trigger if exists project_notes_set_updated_at on public.project_notes;

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create trigger project_notes_set_updated_at
before update on public.project_notes
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.project_notes enable row level security;

grant select, insert, update, delete on table public.projects to anon, authenticated;
grant select, insert, update, delete on table public.project_notes to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

drop policy if exists "Allow project reads" on public.projects;
drop policy if exists "Allow project inserts" on public.projects;
drop policy if exists "Allow project updates" on public.projects;
drop policy if exists "Allow project deletes" on public.projects;
drop policy if exists "Allow project note reads" on public.project_notes;
drop policy if exists "Allow project note inserts" on public.project_notes;
drop policy if exists "Allow project note updates" on public.project_notes;
drop policy if exists "Allow project note deletes" on public.project_notes;

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
  snippets_count
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
    6
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
    5
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
    7
  )
on conflict (slug) do nothing;
