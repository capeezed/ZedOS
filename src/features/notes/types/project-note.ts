export type ProjectNote = {
  id: string
  projectId: string
  title: string
  content: string
  createdAt: string
}

export type CreateProjectNoteInput = {
  projectId: string
  title: string
  content: string
}
