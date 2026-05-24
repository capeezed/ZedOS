import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

import type {
  ActivityEvent,
  CreateActivityEventInput,
} from "../types/activity-event"

type ActivityEventRow = Database["public"]["Tables"]["activity_events"]["Row"] & {
  projects: {
    name: string
    slug: string
  } | null
}
type ActivityEventInsert = Database["public"]["Tables"]["activity_events"]["Insert"]

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

function mapActivityEvent(row: ActivityEventRow): ActivityEvent {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    projectId: row.project_id,
    projectName: row.projects?.name,
    projectSlug: row.projects?.slug,
    entityType: row.entity_type,
    entityId: row.entity_id,
    createdAt: formatDate(row.created_at),
  }
}

function toActivityInsert(input: CreateActivityEventInput): ActivityEventInsert {
  return {
    type: input.type,
    title: input.title,
    description: input.description ?? "",
    project_id: input.projectId ?? null,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    metadata: input.metadata ?? {},
  }
}

export async function listActivityEvents(limit = 12) {
  const { data, error } = await supabase
    .from("activity_events")
    .select("*, projects(name, slug)")
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<ActivityEventRow[]>()

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapActivityEvent)
}

export async function listProjectActivityEvents(projectId: string, limit = 12) {
  const { data, error } = await supabase
    .from("activity_events")
    .select("*, projects(name, slug)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<ActivityEventRow[]>()

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapActivityEvent)
}

export async function createActivityEvent(input: CreateActivityEventInput) {
  const { error } = await supabase
    .from("activity_events")
    .insert(toActivityInsert(input))

  if (error) {
    raiseSupabaseError(error)
  }
}
