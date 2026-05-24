export type ProjectNote = {
  id: string
  projectId: string
  title: string
  content: string
  createdAt: string
}

export type ProjectNoteWithProject = ProjectNote & {
  project: {
    id: string
    slug: string
    name: string
  } | null
}

export type CreateProjectNoteInput = {
  projectId: string
  title: string
  content: string
}
