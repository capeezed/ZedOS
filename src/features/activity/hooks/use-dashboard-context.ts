import { useCallback, useEffect, useState } from "react"

import { listNotes } from "@/features/notes/services/project-notes-service"
import type { ProjectNoteWithProject } from "@/features/notes/types/project-note"
import { listProjects } from "@/features/projects/projects-service"
import type { Project } from "@/features/projects/types"
import { listSnippets } from "@/features/snippets/services/project-snippets-service"
import type { ProjectSnippetWithProject } from "@/features/snippets/types/project-snippet"
import { listTasks } from "@/features/tasks/services/project-tasks-service"
import type { ProjectTaskWithProject } from "@/features/tasks/types/project-task"

type DashboardContext = {
  recentProjects: Project[]
  recentNotes: ProjectNoteWithProject[]
  recentSnippets: ProjectSnippetWithProject[]
  recentTasks: ProjectTaskWithProject[]
}

const defaultContext: DashboardContext = {
  recentProjects: [],
  recentNotes: [],
  recentSnippets: [],
  recentTasks: [],
}

export function useDashboardContext() {
  const [context, setContext] = useState<DashboardContext>(defaultContext)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadContext = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [projects, notes, snippets, tasks] = await Promise.all([
        listProjects(),
        listNotes(),
        listSnippets(),
        listTasks(),
      ])

      setContext({
        recentProjects: projects.slice(0, 4),
        recentNotes: notes.slice(0, 4),
        recentSnippets: snippets.slice(0, 4),
        recentTasks: tasks.slice(0, 4),
      })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar contexto do dashboard"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Dashboard context is assembled from the existing Supabase-backed modules.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadContext()
  }, [loadContext])

  return {
    context,
    isLoading,
    error,
    reload: loadContext,
  }
}
