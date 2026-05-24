import { useCallback, useEffect, useMemo, useState } from "react"

import {
  createProjectLink,
  deleteProjectLink,
  listProjectLinks,
} from "../services/project-links-service"
import type { CreateProjectLinkInput, ProjectLink } from "../types/project-link"

export function useProjectLinks(projectId: string) {
  const [links, setLinks] = useState<ProjectLink[]>([])
  const [category, setCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadLinks = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setLinks(await listProjectLinks(projectId))
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Erro ao carregar links"
      )
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // Links are synchronized with Supabase when the active project changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLinks()
  }, [loadLinks])

  const categories = useMemo(
    () => Array.from(new Set(links.map((link) => link.category))).sort(),
    [links]
  )

  const filteredLinks = useMemo(() => {
    if (category === "all") {
      return links
    }

    return links.filter((link) => link.category === category)
  }, [category, links])

  const addLink = async (input: Omit<CreateProjectLinkInput, "projectId">) => {
    const link = await createProjectLink({ ...input, projectId })
    setLinks((current) => [link, ...current])
  }

  const removeLink = async (linkId: string) => {
    await deleteProjectLink(linkId)
    setLinks((current) => current.filter((link) => link.id !== linkId))
  }

  return {
    links,
    filteredLinks,
    categories,
    category,
    setCategory,
    isLoading,
    error,
    reload: loadLinks,
    addLink,
    removeLink,
  }
}
