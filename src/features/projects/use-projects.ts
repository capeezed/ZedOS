import { useCallback, useEffect, useState } from "react"

import {
  createProject,
  deleteProject,
  getProjectBySlug,
  listProjects,
  updateProject,
} from "./projects-service"
import type { CreateProjectInput, Project, UpdateProjectInput } from "./types"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setProjects(await listProjects())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erro ao carregar projetos")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Project data is loaded from Supabase when the page mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProjects()
  }, [loadProjects])

  const addProject = async (input: CreateProjectInput) => {
    const project = await createProject(input)
    setProjects((current) => [project, ...current])
  }

  return {
    projects,
    isLoading,
    error,
    reload: loadProjects,
    addProject,
  }
}

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProject = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setProject(await getProjectBySlug(slug))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erro ao carregar projeto")
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    // Project detail is loaded from Supabase whenever the slug changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProject()
  }, [loadProject])

  const saveProject = async (id: string, input: UpdateProjectInput) => {
    const updatedProject = await updateProject(id, input)
    setProject(updatedProject)
  }

  const removeProject = async (id: string) => {
    await deleteProject(id)
  }

  return {
    project,
    isLoading,
    error,
    reload: loadProject,
    saveProject,
    removeProject,
  }
}
