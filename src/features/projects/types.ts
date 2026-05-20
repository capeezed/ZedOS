export type ProjectStatus = "active" | "paused" | "backlog" | "archived"

export type ProjectPriority = "high" | "medium" | "low"

export type Project = {
  id: string
  slug: string
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  area: string
  stack: string[]
  updatedAt: string
  nextAction: string
  notesCount: number
  snippetsCount: number
}

export type CreateProjectInput = {
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  area: string
  stack: string[]
  nextAction: string
}

export type UpdateProjectInput = Partial<CreateProjectInput>

export type ProjectNote = {
  id: string
  projectId: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}
