export type ActivityEventType =
  | "project_created"
  | "project_updated"
  | "note_created"
  | "note_deleted"
  | "snippet_created"
  | "snippet_deleted"
  | "task_created"
  | "task_updated"
  | "task_completed"
  | "task_deleted"
  | "link_created"
  | "link_deleted"

export type ActivityEvent = {
  id: string
  type: ActivityEventType | string
  title: string
  description: string
  projectId: string | null
  projectName?: string
  projectSlug?: string
  entityType: string | null
  entityId: string | null
  createdAt: string
}

export type CreateActivityEventInput = {
  type: ActivityEventType
  title: string
  description?: string
  projectId?: string | null
  entityType?: string | null
  entityId?: string | null
  metadata?: Record<string, string | number | boolean | null>
}
