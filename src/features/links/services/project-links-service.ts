import { createActivityEvent } from "@/features/activity/services/activity-service"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

import type {
  CreateProjectLinkInput,
  ProjectLink,
  ProjectLinkWithProject,
} from "../types/project-link"

type ProjectLinkRow = Database["public"]["Tables"]["project_links"]["Row"]
type ProjectLinkInsert = Database["public"]["Tables"]["project_links"]["Insert"]
type ProjectLinkJoinRow = ProjectLinkRow & {
  projects: {
    id: string
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function normalizeUrl(value: string) {
  const trimmedValue = value.trim()

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue
  }

  return `https://${trimmedValue}`
}

function mapProjectLinkRow(row: ProjectLinkRow): ProjectLink {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    url: row.url,
    description: row.description,
    category: row.category,
    createdAt: formatDate(row.created_at),
  }
}

function mapProjectLinkJoinRow(row: ProjectLinkJoinRow): ProjectLinkWithProject {
  return {
    ...mapProjectLinkRow(row),
    project: row.projects,
  }
}

function toProjectLinkInsert(input: CreateProjectLinkInput): ProjectLinkInsert {
  return {
    project_id: input.projectId,
    title: input.title,
    url: normalizeUrl(input.url),
    description: input.description,
    category: input.category || "reference",
  }
}

export async function listProjectLinks(projectId: string) {
  const { data, error } = await supabase
    .from("project_links")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapProjectLinkRow)
}

export async function listLinks() {
  const { data, error } = await supabase
    .from("project_links")
    .select("*, projects(id, slug, name)")
    .order("created_at", { ascending: false })
    .returns<ProjectLinkJoinRow[]>()

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapProjectLinkJoinRow)
}

export async function getProjectLink(linkId: string) {
  const { data, error } = await supabase
    .from("project_links")
    .select("*")
    .eq("id", linkId)
    .maybeSingle()

  if (error) {
    raiseSupabaseError(error)
  }

  return data ? mapProjectLinkRow(data) : null
}

export async function createProjectLink(input: CreateProjectLinkInput) {
  const { data, error } = await supabase
    .from("project_links")
    .insert(toProjectLinkInsert(input))
    .select("*")
    .single()

  if (error) {
    raiseSupabaseError(error)
  }

  if (!data) {
    throw new Error("Link criado, mas o Supabase nao retornou o registro.")
  }

  const link = mapProjectLinkRow(data)

  await createActivityEvent({
    type: "link_created",
    title: `Link criado: ${link.title}`,
    description: link.url,
    projectId: link.projectId,
    entityType: "project_link",
    entityId: link.id,
    metadata: {
      category: link.category,
    },
  })

  return link
}

export async function deleteProjectLink(linkId: string) {
  const link = await getProjectLink(linkId)
  const { error } = await supabase.from("project_links").delete().eq("id", linkId)

  if (error) {
    raiseSupabaseError(error)
  }

  if (link) {
    await createActivityEvent({
      type: "link_deleted",
      title: `Link removido: ${link.title}`,
      description: link.url,
      projectId: link.projectId,
      entityType: "project_link",
      entityId: link.id,
      metadata: {
        category: link.category,
      },
    })
  }
}
