export type SearchResultType =
  | "project"
  | "note"
  | "snippet"
  | "task"
  | "link"
  | "action"
  | "activity"

export type SearchResult = {
  id: string
  type: SearchResultType
  title: string
  description: string
  href: string
  projectName?: string
  meta: string
  searchableText: string
  scoreText: {
    title: string
    body: string
  }
  createdAt?: string
}
