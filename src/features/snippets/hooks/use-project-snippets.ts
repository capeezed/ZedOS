import { useCallback, useEffect, useMemo, useState } from "react"

import {
  createProjectSnippet,
  deleteProjectSnippet,
  listProjectSnippets,
} from "../services/project-snippets-service"
import type {
  CreateProjectSnippetInput,
  ProjectSnippet,
} from "../types/project-snippet"

export function useProjectSnippets(projectId: string) {
  const [snippets, setSnippets] = useState<ProjectSnippet[]>([])
  const [language, setLanguage] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSnippets = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setSnippets(await listProjectSnippets(projectId))
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Erro ao carregar snippets"
      )
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // Snippets are synchronized with Supabase when the active project changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSnippets()
  }, [loadSnippets])

  const languages = useMemo(
    () => Array.from(new Set(snippets.map((snippet) => snippet.language))).sort(),
    [snippets]
  )

  const filteredSnippets = useMemo(() => {
    if (language === "all") {
      return snippets
    }

    return snippets.filter((snippet) => snippet.language === language)
  }, [language, snippets])

  const addSnippet = async (
    input: Omit<CreateProjectSnippetInput, "projectId">
  ) => {
    const snippet = await createProjectSnippet({ ...input, projectId })
    setSnippets((current) => [snippet, ...current])
  }

  const removeSnippet = async (snippetId: string) => {
    await deleteProjectSnippet(snippetId)
    setSnippets((current) => current.filter((snippet) => snippet.id !== snippetId))
  }

  return {
    snippets,
    filteredSnippets,
    languages,
    language,
    setLanguage,
    isLoading,
    error,
    reload: loadSnippets,
    addSnippet,
    removeSnippet,
  }
}
