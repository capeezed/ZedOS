import { useCallback, useEffect, useMemo, useState } from "react"

import {
  deleteProjectSnippet,
  listSnippets,
} from "../services/project-snippets-service"
import type { ProjectSnippetWithProject } from "../types/project-snippet"

export function useSnippets() {
  const [snippets, setSnippets] = useState<ProjectSnippetWithProject[]>([])
  const [query, setQuery] = useState("")
  const [projectSlug, setProjectSlug] = useState("all")
  const [language, setLanguage] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSnippets = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setSnippets(await listSnippets())
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Erro ao carregar snippets"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Global snippets are loaded from Supabase for search and filtering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSnippets()
  }, [loadSnippets])

  const projects = useMemo(() => {
    const projectMap = new Map<string, { slug: string; name: string }>()

    snippets.forEach((snippet) => {
      if (snippet.project) {
        projectMap.set(snippet.project.slug, {
          slug: snippet.project.slug,
          name: snippet.project.name,
        })
      }
    })

    return Array.from(projectMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [snippets])

  const languages = useMemo(
    () => Array.from(new Set(snippets.map((snippet) => snippet.language))).sort(),
    [snippets]
  )

  const filteredSnippets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return snippets.filter((snippet) => {
      const matchesProject =
        projectSlug === "all" || snippet.project?.slug === projectSlug
      const matchesLanguage =
        language === "all" || snippet.language === language
      const searchableText = [
        snippet.title,
        snippet.description,
        snippet.code,
        snippet.language,
        snippet.project?.name ?? "",
        ...snippet.tags,
      ]
        .join(" ")
        .toLowerCase()

      return (
        matchesProject &&
        matchesLanguage &&
        searchableText.includes(normalizedQuery)
      )
    })
  }, [language, projectSlug, query, snippets])

  const removeSnippet = async (snippetId: string) => {
    await deleteProjectSnippet(snippetId)
    setSnippets((current) => current.filter((snippet) => snippet.id !== snippetId))
  }

  const clearFilters = () => {
    setQuery("")
    setProjectSlug("all")
    setLanguage("all")
  }

  return {
    snippets,
    filteredSnippets,
    projects,
    languages,
    query,
    setQuery,
    projectSlug,
    setProjectSlug,
    language,
    setLanguage,
    isLoading,
    error,
    reload: loadSnippets,
    removeSnippet,
    clearFilters,
  }
}
