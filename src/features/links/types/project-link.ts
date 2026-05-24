export type ProjectLink = {
  id: string
  projectId: string
  title: string
  url: string
  description: string
  category: string
  createdAt: string
}

export type ProjectLinkWithProject = ProjectLink & {
  project: {
    id: string
    slug: string
    name: string
  } | null
}

export type CreateProjectLinkInput = {
  projectId: string
  title: string
  url: string
  description: string
  category: string
}
