import { createActivityEvent } from "@/features/activity/services/activity-service"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

import type {
  CreateProjectTaskInput,
  ProjectTask,
  ProjectTaskWithProject,
  UpdateProjectTaskInput,
} from "../types/project-task"

type ProjectTaskRow = Database["public"]["Tables"]["project_tasks"]["Row"]
type ProjectTaskInsert = Database["public"]["Tables"]["project_tasks"]["Insert"]
type ProjectTaskUpdate = Database["public"]["Tables"]["project_tasks"]["Update"]
type ProjectTaskJoinRow = ProjectTaskRow & {
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

function mapProjectTaskRow(row: ProjectTaskRow): ProjectTask {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    createdAt: formatDate(row.created_at),
  }
}

function mapProjectTaskJoinRow(row: ProjectTaskJoinRow): ProjectTaskWithProject {
  return {
    ...mapProjectTaskRow(row),
    project: row.projects,
  }
}

function toProjectTaskInsert(input: CreateProjectTaskInput): ProjectTaskInsert {
  return {
    project_id: input.projectId,
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    due_date: input.dueDate,
  }
}

function toProjectTaskUpdate(input: UpdateProjectTaskInput): ProjectTaskUpdate {
  return {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.dueDate !== undefined ? { due_date: input.dueDate } : {}),
  }
}

export async function listProjectTasks(projectId: string) {
  const { data, error } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapProjectTaskRow)
}

export async function listTasks() {
  const { data, error } = await supabase
    .from("project_tasks")
    .select("*, projects(id, slug, name)")
    .order("created_at", { ascending: false })
    .returns<ProjectTaskJoinRow[]>()

  if (error) {
    raiseSupabaseError(error)
  }

  return (data ?? []).map(mapProjectTaskJoinRow)
}

export async function getProjectTask(taskId: string) {
  const { data, error } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("id", taskId)
    .maybeSingle()

  if (error) {
    raiseSupabaseError(error)
  }

  return data ? mapProjectTaskRow(data) : null
}

export async function createProjectTask(input: CreateProjectTaskInput) {
  const { data, error } = await supabase
    .from("project_tasks")
    .insert(toProjectTaskInsert(input))
    .select("*")
    .single()

  if (error) {
    raiseSupabaseError(error)
  }

  if (!data) {
    throw new Error("Task criada, mas o Supabase nao retornou o registro.")
  }

  const task = mapProjectTaskRow(data)

  await createActivityEvent({
    type: "task_created",
    title: `Task criada: ${task.title}`,
    description: task.description,
    projectId: task.projectId,
    entityType: "project_task",
    entityId: task.id,
    metadata: {
      status: task.status,
      priority: task.priority,
    },
  })

  return task
}

export async function updateProjectTask(
  taskId: string,
  input: UpdateProjectTaskInput
) {
  const { data, error } = await supabase
    .from("project_tasks")
    .update(toProjectTaskUpdate(input))
    .eq("id", taskId)
    .select("*")
    .single()

  if (error) {
    raiseSupabaseError(error)
  }

  if (!data) {
    throw new Error("Task atualizada, mas o Supabase nao retornou o registro.")
  }

  const task = mapProjectTaskRow(data)

  await createActivityEvent({
    type: task.status === "done" ? "task_completed" : "task_updated",
    title:
      task.status === "done"
        ? `Task concluida: ${task.title}`
        : `Task atualizada: ${task.title}`,
    description: task.description,
    projectId: task.projectId,
    entityType: "project_task",
    entityId: task.id,
    metadata: {
      status: task.status,
      priority: task.priority,
    },
  })

  return task
}

export async function deleteProjectTask(taskId: string) {
  const task = await getProjectTask(taskId)
  const { error } = await supabase.from("project_tasks").delete().eq("id", taskId)

  if (error) {
    raiseSupabaseError(error)
  }

  if (task) {
    await createActivityEvent({
      type: "task_deleted",
      title: `Task removida: ${task.title}`,
      description: task.description,
      projectId: task.projectId,
      entityType: "project_task",
      entityId: task.id,
      metadata: {
        status: task.status,
        priority: task.priority,
      },
    })
  }
}
