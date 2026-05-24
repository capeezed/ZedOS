export type ProjectTaskStatus = "todo" | "doing" | "done"

export type ProjectTaskPriority = "high" | "medium" | "low"

export type ProjectTask = {
  id: string
  projectId: string
  title: string
  description: string
  status: ProjectTaskStatus
  priority: ProjectTaskPriority
  dueDate: string | null
  createdAt: string
}

export type ProjectTaskWithProject = ProjectTask & {
  project: {
    id: string
    slug: string
    name: string
  } | null
}

export type CreateProjectTaskInput = {
  projectId: string
  title: string
  description: string
  status: ProjectTaskStatus
  priority: ProjectTaskPriority
  dueDate: string | null
}

export type UpdateProjectTaskInput = Partial<
  Pick<ProjectTask, "title" | "description" | "status" | "priority" | "dueDate">
>
