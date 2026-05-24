import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

import type {
  CreateProjectSnippetInput,
  ProjectSnippet,
  ProjectSnippetWithProject,
} from "../types/project-snippet"

type ProjectSnippetRow = Database["public"]["Tables"]["project_snippets"]["Row"]
type ProjectSnippetInsert = Database["public"]["Tables"]["project_snippets"]["Insert"]
type ProjectSnippetJoinRow = ProjectSnippetRow & {
  projects: {
    id: string
    slug: string
    name: string
  } | null
}

function raiseSupabaseError(error: { code?: string; message: string }): never {
  throw new Error(error.code ? `${error.message} (${error.code})` : error.message)
}

function mapProjectSnippetRow(row: ProjectSnippetRow): ProjectSnippet {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    code: row.code,
    language: row.language,
    tags: row.tags,
    createdAt: new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(row.created_at)),
  }
}

function mapProjectSnippetJoinRow(row: ProjectSnippetJoinRow): ProjectSnippetWithProject {
  return {
    ...mapProjectSnippetRow(row),
    project: row.projects,
  }
}

function toProjectSnippetInsert(
  input: CreateProjectSnippetInput
): ProjectSnippetInsert {
  return {
    project_id: input.projectId,
    title: input.title,
    description: input.description,
    code: input.code,
    language: input.language || "text",
    tags: input.tags,
  }
}

export async function listProjectSnippets(projectId: string) {
  const { data, error } = await supabase
    .from("project_snippets")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapProjectSnippetRow)
}

export async function listSnippets() {
  const { data, error } = await supabase
    .from("project_snippets")
    .select("*, projects(id, slug, name)")
    .order("created_at", { ascending: false })
    .returns<ProjectSnippetJoinRow[]>()

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapProjectSnippetJoinRow)
}

export async function createProjectSnippet(input: CreateProjectSnippetInput) {
  const { data, error } = await supabase
    .from("project_snippets")
    .insert(toProjectSnippetInsert(input))
    .select("*")
    .single()

  if (error) {
    raiseSupabaseError(error)
  }

  if (!data) {
    throw new Error("Snippet criado, mas o Supabase nao retornou o registro.")
  }

  return mapProjectSnippetRow(data)
}

export async function deleteProjectSnippet(snippetId: string) {
  const { error } = await supabase
    .from("project_snippets")
    .delete()
    .eq("id", snippetId)

  if (error) {
    raiseSupabaseError(error)
  }
}
