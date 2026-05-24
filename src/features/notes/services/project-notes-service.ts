import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"
import { createActivityEvent } from "@/features/activity/services/activity-service"

import type {
  CreateProjectNoteInput,
  ProjectNote,
  ProjectNoteWithProject,
} from "../types/project-note"

type ProjectNoteRow = Database["public"]["Tables"]["project_notes"]["Row"]
type ProjectNoteInsert = Database["public"]["Tables"]["project_notes"]["Insert"]
type ProjectNoteJoinRow = ProjectNoteRow & {
  projects: {
    id: string
    slug: string
    name: string
  } | null
}

function raiseSupabaseError(error: { code?: string; message: string }): never {
  throw new Error(error.code ? `${error.message} (${error.code})` : error.message)
}

function mapProjectNoteRow(row: ProjectNoteRow): ProjectNote {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    content: row.content,
    createdAt: new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(row.created_at)),
  }
}

function mapProjectNoteJoinRow(row: ProjectNoteJoinRow): ProjectNoteWithProject {
  return {
    ...mapProjectNoteRow(row),
    project: row.projects,
  }
}

function toProjectNoteInsert(input: CreateProjectNoteInput): ProjectNoteInsert {
  return {
    project_id: input.projectId,
    title: input.title,
    content: input.content,
  }
}

export async function listProjectNotes(projectId: string) {
  const { data, error } = await supabase
    .from("project_notes")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapProjectNoteRow)
}

export async function listNotes() {
  const { data, error } = await supabase
    .from("project_notes")
    .select("*, projects(id, slug, name)")
    .order("created_at", { ascending: false })
    .returns<ProjectNoteJoinRow[]>()

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapProjectNoteJoinRow)
}

export async function getProjectNote(noteId: string) {
  const { data, error } = await supabase
    .from("project_notes")
    .select("*")
    .eq("id", noteId)
    .maybeSingle()

  if (error) {
    raiseSupabaseError(error)
  }

  return data ? mapProjectNoteRow(data) : null
}

export async function createProjectNote(input: CreateProjectNoteInput) {
  const { data, error } = await supabase
    .from("project_notes")
    .insert(toProjectNoteInsert(input))
    .select("*")
    .single()

  if (error) {
    raiseSupabaseError(error)
  }

  if (!data) {
    throw new Error("Nota criada, mas o Supabase nao retornou o registro.")
  }

  const note = mapProjectNoteRow(data)

  await createActivityEvent({
    type: "note_created",
    title: `Nota criada: ${note.title}`,
    description: note.content,
    projectId: note.projectId,
    entityType: "project_note",
    entityId: note.id,
  })

  return note
}

export async function deleteProjectNote(noteId: string) {
  const note = await getProjectNote(noteId)
  const { error } = await supabase.from("project_notes").delete().eq("id", noteId)

  if (error) {
    raiseSupabaseError(error)
  }

  if (note) {
    await createActivityEvent({
      type: "note_deleted",
      title: `Nota removida: ${note.title}`,
      description: note.content,
      projectId: note.projectId,
      entityType: "project_note",
      entityId: note.id,
    })
  }
}
