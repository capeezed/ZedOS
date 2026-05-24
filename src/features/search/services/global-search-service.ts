import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

import type { SearchResult } from "../types/search-result"

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"]
type ProjectNoteRow = Database["public"]["Tables"]["project_notes"]["Row"] & {
  projects: {
    slug: string
    name: string
  } | null
}
type ProjectSnippetRow = Database["public"]["Tables"]["project_snippets"]["Row"] & {
  projects: {
    slug: string
    name: string
  } | null
}
type ProjectTaskRow = Database["public"]["Tables"]["project_tasks"]["Row"] & {
  projects: {
    slug: string
    name: string
  } | null
}
type ProjectLinkRow = Database["public"]["Tables"]["project_links"]["Row"] & {
  projects: {
    slug: string
    name: string
  } | null
}
type ActivityEventRow = Database["public"]["Tables"]["activity_events"]["Row"] & {
  projects: {
    slug: string
    name: string
  } | null
}

function raiseSupabaseError(error: { code?: string; message: string }): never {
  throw new Error(error.code ? `${error.message} (${error.code})` : error.message)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value))
}

function buildSearchableText(parts: Array<string | string[] | null | undefined>) {
  return parts.flat().filter(Boolean).join(" ").toLowerCase()
}

function mapProject(row: ProjectRow): SearchResult {
  return {
    id: row.id,
    type: "project",
    title: row.name,
    description: row.description || row.next_action,
    href: `/projects/${row.slug}`,
    projectName: row.name,
    meta: `Project - ${row.area || "Workspace"} - ${formatDate(row.updated_at)}`,
    searchableText: buildSearchableText([
      row.name,
      row.description,
      row.area,
      row.next_action,
      row.status,
      row.priority,
      row.stack,
    ]),
    scoreText: {
      title: row.name.toLowerCase(),
      body: buildSearchableText([row.description, row.area, row.next_action, row.stack]),
    },
    createdAt: row.updated_at,
  }
}

function mapNote(row: ProjectNoteRow): SearchResult {
  const projectSlug = row.projects?.slug ?? "projects"
  const projectName = row.projects?.name ?? "Projeto"

  return {
    id: row.id,
    type: "note",
    title: row.title,
    description: row.content,
    href: `/projects/${projectSlug}`,
    projectName,
    meta: `Note - ${projectName} - ${formatDate(row.created_at)}`,
    searchableText: buildSearchableText([row.title, row.content, projectName]),
    scoreText: {
      title: row.title.toLowerCase(),
      body: buildSearchableText([row.content, projectName]),
    },
    createdAt: row.created_at,
  }
}

function mapSnippet(row: ProjectSnippetRow): SearchResult {
  const projectSlug = row.projects?.slug ?? "projects"
  const projectName = row.projects?.name ?? "Projeto"

  return {
    id: row.id,
    type: "snippet",
    title: row.title,
    description: row.description || row.code,
    href: `/projects/${projectSlug}`,
    projectName,
    meta: `Snippet - ${projectName} - ${row.language}`,
    searchableText: buildSearchableText([
      row.title,
      row.description,
      row.code,
      row.language,
      row.tags,
      projectName,
    ]),
    scoreText: {
      title: row.title.toLowerCase(),
      body: buildSearchableText([
        row.description,
        row.code,
        row.language,
        row.tags,
        projectName,
      ]),
    },
    createdAt: row.created_at,
  }
}

function mapTask(row: ProjectTaskRow): SearchResult {
  const projectSlug = row.projects?.slug ?? "projects"
  const projectName = row.projects?.name ?? "Projeto"

  return {
    id: row.id,
    type: "task",
    title: row.title,
    description: row.description || row.status,
    href: `/projects/${projectSlug}`,
    projectName,
    meta: `Task - ${projectName} - ${row.status}`,
    searchableText: buildSearchableText([
      row.title,
      row.description,
      row.status,
      row.priority,
      projectName,
    ]),
    scoreText: {
      title: row.title.toLowerCase(),
      body: buildSearchableText([
        row.description,
        row.status,
        row.priority,
        projectName,
      ]),
    },
    createdAt: row.created_at,
  }
}

function mapLink(row: ProjectLinkRow): SearchResult {
  const projectSlug = row.projects?.slug ?? "projects"
  const projectName = row.projects?.name ?? "Projeto"

  return {
    id: row.id,
    type: "link",
    title: row.title,
    description: row.description || row.url,
    href: `/projects/${projectSlug}`,
    projectName,
    meta: `Link - ${projectName} - ${row.category}`,
    searchableText: buildSearchableText([
      row.title,
      row.description,
      row.url,
      row.category,
      projectName,
    ]),
    scoreText: {
      title: row.title.toLowerCase(),
      body: buildSearchableText([row.description, row.url, row.category, projectName]),
    },
    createdAt: row.created_at,
  }
}

function mapActivity(row: ActivityEventRow): SearchResult {
  const projectSlug = row.projects?.slug ?? "projects"
  const projectName = row.projects?.name ?? "Workspace"

  return {
    id: row.id,
    type: "activity",
    title: row.title,
    description: row.description,
    href: `/projects/${projectSlug}`,
    projectName,
    meta: `Recent - ${projectName} - ${formatDate(row.created_at)}`,
    searchableText: buildSearchableText([
      row.title,
      row.description,
      row.type,
      row.entity_type,
      projectName,
    ]),
    scoreText: {
      title: row.title.toLowerCase(),
      body: buildSearchableText([row.description, row.type, row.entity_type, projectName]),
    },
    createdAt: row.created_at,
  }
}

function getQuickActions(): SearchResult[] {
  return [
    {
      id: "action-open-dashboard",
      type: "action",
      title: "Abrir dashboard",
      description: "Voltar para a visao operacional do workspace",
      href: "/",
      meta: "Action - Dashboard",
      searchableText: "abrir dashboard home inicio workspace atividade recente",
      scoreText: {
        title: "abrir dashboard",
        body: "home inicio workspace atividade recente",
      },
    },
    {
      id: "action-open-projects",
      type: "action",
      title: "Abrir projetos",
      description: "Ir para a lista de projetos",
      href: "/projects",
      meta: "Action - Workspace",
      searchableText: "abrir projetos projects workspace lista",
      scoreText: {
        title: "abrir projetos",
        body: "projects workspace lista",
      },
    },
    {
      id: "action-open-notes",
      type: "action",
      title: "Abrir notas",
      description: "Buscar memoria operacional entre projetos",
      href: "/notes",
      meta: "Action - Notes",
      searchableText: "abrir notas notes memoria operacional decisoes contexto",
      scoreText: {
        title: "abrir notas",
        body: "memoria operacional decisoes contexto",
      },
    },
    {
      id: "action-open-snippets",
      type: "action",
      title: "Abrir snippets",
      description: "Buscar conhecimento tecnico reutilizavel",
      href: "/snippets",
      meta: "Action - Snippets",
      searchableText: "abrir snippets codigo comando query helper",
      scoreText: {
        title: "abrir snippets",
        body: "codigo comando query helper",
      },
    },
    {
      id: "action-new-project",
      type: "action",
      title: "Criar projeto",
      description: "Abrir a tela de projetos para criar um novo contexto",
      href: "/projects",
      meta: "Action - Create",
      searchableText: "criar novo projeto new project create",
      scoreText: {
        title: "criar projeto",
        body: "novo project create",
      },
    },
  ]
}

export async function loadGlobalSearchIndex() {
  const [
    projectsResult,
    notesResult,
    snippetsResult,
    tasksResult,
    linksResult,
    activityResult,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(50),
    supabase
      .from("project_notes")
      .select("*, projects(slug, name)")
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<ProjectNoteRow[]>(),
    supabase
      .from("project_snippets")
      .select("*, projects(slug, name)")
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<ProjectSnippetRow[]>(),
    supabase
      .from("project_tasks")
      .select("*, projects(slug, name)")
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<ProjectTaskRow[]>(),
    supabase
      .from("project_links")
      .select("*, projects(slug, name)")
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<ProjectLinkRow[]>(),
    supabase
      .from("activity_events")
      .select("*, projects(slug, name)")
      .order("created_at", { ascending: false })
      .limit(20)
      .returns<ActivityEventRow[]>(),
  ])

  if (projectsResult.error) {
    raiseSupabaseError(projectsResult.error)
  }

  if (notesResult.error) {
    raiseSupabaseError(notesResult.error)
  }

  if (snippetsResult.error) {
    raiseSupabaseError(snippetsResult.error)
  }

  if (tasksResult.error) {
    raiseSupabaseError(tasksResult.error)
  }

  if (linksResult.error) {
    raiseSupabaseError(linksResult.error)
  }

  if (activityResult.error) {
    raiseSupabaseError(activityResult.error)
  }

  return [
    ...getQuickActions(),
    ...(activityResult.data ?? []).map(mapActivity),
    ...(projectsResult.data ?? []).map(mapProject),
    ...(notesResult.data ?? []).map(mapNote),
    ...(snippetsResult.data ?? []).map(mapSnippet),
    ...(tasksResult.data ?? []).map(mapTask),
    ...(linksResult.data ?? []).map(mapLink),
  ]
}
