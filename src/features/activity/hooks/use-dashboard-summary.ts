import { useCallback, useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"

type DashboardSummary = {
  projectsCount: number
  activeProjectsCount: number
  notesCount: number
  snippetsCount: number
  tasksCount: number
}

const defaultSummary: DashboardSummary = {
  projectsCount: 0,
  activeProjectsCount: 0,
  notesCount: 0,
  snippetsCount: 0,
  tasksCount: 0,
}

export function useDashboardSummary() {
  const [summary, setSummary] = useState(defaultSummary)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSummary = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [
        projectsResult,
        activeProjectsResult,
        notesResult,
        snippetsResult,
        tasksResult,
      ] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("project_notes")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("project_snippets")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("project_tasks")
          .select("id", { count: "exact", head: true }),
      ])

      const error =
        projectsResult.error ??
        activeProjectsResult.error ??
        notesResult.error ??
        snippetsResult.error ??
        tasksResult.error

      if (error) {
        throw new Error(error.message)
      }

      setSummary({
        projectsCount: projectsResult.count ?? 0,
        activeProjectsCount: activeProjectsResult.count ?? 0,
        notesCount: notesResult.count ?? 0,
        snippetsCount: snippetsResult.count ?? 0,
        tasksCount: tasksResult.count ?? 0,
      })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar resumo"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Dashboard metrics are read from Supabase on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSummary()
  }, [loadSummary])

  return {
    summary,
    isLoading,
    error,
    reload: loadSummary,
  }
}
