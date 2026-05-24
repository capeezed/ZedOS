import { useCallback, useEffect, useMemo, useState } from "react"

import { deleteProjectNote, listNotes } from "../services/project-notes-service"
import type { ProjectNoteWithProject } from "../types/project-note"

export function useNotes() {
  const [notes, setNotes] = useState<ProjectNoteWithProject[]>([])
  const [query, setQuery] = useState("")
  const [projectSlug, setProjectSlug] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotes = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setNotes(await listNotes())
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Erro ao carregar notas"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Global notes are loaded from Supabase for cross-project recall.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNotes()
  }, [loadNotes])

  const projects = useMemo(() => {
    const projectMap = new Map<string, { slug: string; name: string }>()

    notes.forEach((note) => {
      if (note.project) {
        projectMap.set(note.project.slug, {
          slug: note.project.slug,
          name: note.project.name,
        })
      }
    })

    return Array.from(projectMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [notes])

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return notes.filter((note) => {
      const matchesProject =
        projectSlug === "all" || note.project?.slug === projectSlug
      const searchableText = [note.title, note.content, note.project?.name ?? ""]
        .join(" ")
        .toLowerCase()

      return matchesProject && searchableText.includes(normalizedQuery)
    })
  }, [notes, projectSlug, query])

  const removeNote = async (noteId: string) => {
    await deleteProjectNote(noteId)
    setNotes((current) => current.filter((note) => note.id !== noteId))
  }

  const clearFilters = () => {
    setQuery("")
    setProjectSlug("all")
  }

  return {
    notes,
    filteredNotes,
    projects,
    query,
    setQuery,
    projectSlug,
    setProjectSlug,
    isLoading,
    error,
    reload: loadNotes,
    removeNote,
    clearFilters,
  }
}
