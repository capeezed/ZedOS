import { useCallback, useEffect, useState } from "react"

import {
  createProjectNote,
  deleteProjectNote,
  listProjectNotes,
} from "../services/project-notes-service"
import type { CreateProjectNoteInput, ProjectNote } from "../types/project-note"

export function useProjectNotes(projectId: string) {
  const [notes, setNotes] = useState<ProjectNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotes = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setNotes(await listProjectNotes(projectId))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erro ao carregar notas")
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // Notes are synchronized with Supabase when the active project changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNotes()
  }, [loadNotes])

  const addNote = async (input: Omit<CreateProjectNoteInput, "projectId">) => {
    const note = await createProjectNote({ ...input, projectId })
    setNotes((current) => [note, ...current])
  }

  const removeNote = async (noteId: string) => {
    await deleteProjectNote(noteId)
    setNotes((current) => current.filter((note) => note.id !== noteId))
  }

  return {
    notes,
    isLoading,
    error,
    reload: loadNotes,
    addNote,
    removeNote,
  }
}
