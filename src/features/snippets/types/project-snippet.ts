export type ProjectSnippet = {
  id: string
  projectId: string
  title: string
  description: string
  code: string
  language: string
  tags: string[]
  createdAt: string
}

export type ProjectSnippetWithProject = ProjectSnippet & {
  project: {
    id: string
    slug: string
    name: string
  } | null
}

export type CreateProjectSnippetInput = {
  projectId: string
  title: string
  description: string
  code: string
  language: string
  tags: string[]
}
