import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

import type { CreateProjectInput, Project, UpdateProjectInput } from "./types"

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"]
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

function raiseSupabaseError(error: { code?: string; message: string }): never {
  throw new Error(error.code ? `${error.message} (${error.code})` : error.message)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    status: row.status,
    priority: row.priority,
    area: row.area,
    stack: row.stack,
    updatedAt: new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(new Date(row.updated_at)),
    nextAction: row.next_action,
    notesCount: row.notes_count,
    snippetsCount: row.snippets_count,
  }
}

function toProjectInsert(input: CreateProjectInput): ProjectInsert {
  return {
    slug: slugify(input.name),
    name: input.name,
    description: input.description,
    status: input.status,
    priority: input.priority,
    area: input.area,
    stack: input.stack,
    next_action: input.nextAction,
  }
}

function toProjectUpdate(input: UpdateProjectInput): ProjectUpdate {
  return {
    ...(input.name ? { name: input.name, slug: slugify(input.name) } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(input.priority ? { priority: input.priority } : {}),
    ...(input.area !== undefined ? { area: input.area } : {}),
    ...(input.stack ? { stack: input.stack } : {}),
    ...(input.nextAction !== undefined ? { next_action: input.nextAction } : {}),
  }
}

export async function listProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false })

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapProjectRow)
}

export async function getProjectBySlug(slug: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    raiseSupabaseError(error)
  }

  return data ? mapProjectRow(data) : null
}

export async function createProject(input: CreateProjectInput) {
  const { data, error } = await supabase
    .from("projects")
    .insert(toProjectInsert(input))
    .select("*")
    .single()

  if (error) {
    raiseSupabaseError(error)
  }

  if (!data) {
    throw new Error("Projeto criado, mas o Supabase nao retornou o registro.")
  }

  return mapProjectRow(data)
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  const { data, error } = await supabase
    .from("projects")
    .update(toProjectUpdate(input))
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    raiseSupabaseError(error)
  }

  if (!data) {
    throw new Error("Projeto atualizado, mas o Supabase nao retornou o registro.")
  }

  return mapProjectRow(data)
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    raiseSupabaseError(error)
  }
}
