import { useCallback, useEffect, useMemo, useState } from "react"

import {
  createProjectTask,
  deleteProjectTask,
  listProjectTasks,
  updateProjectTask,
} from "../services/project-tasks-service"
import type {
  CreateProjectTaskInput,
  ProjectTask,
  ProjectTaskStatus,
} from "../types/project-task"

export function useProjectTasks(projectId: string) {
  const [tasks, setTasks] = useState<ProjectTask[]>([])
  const [status, setStatus] = useState<ProjectTaskStatus | "all">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setTasks(await listProjectTasks(projectId))
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Erro ao carregar tasks"
      )
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // Tasks are synchronized with Supabase when the active project changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTasks()
  }, [loadTasks])

  const filteredTasks = useMemo(() => {
    if (status === "all") {
      return tasks
    }

    return tasks.filter((task) => task.status === status)
  }, [status, tasks])

  const taskCounts = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === "todo").length,
      doing: tasks.filter((task) => task.status === "doing").length,
      done: tasks.filter((task) => task.status === "done").length,
    }),
    [tasks]
  )

  const addTask = async (input: Omit<CreateProjectTaskInput, "projectId">) => {
    const task = await createProjectTask({ ...input, projectId })
    setTasks((current) => [task, ...current])
  }

  const changeTaskStatus = async (
    taskId: string,
    nextStatus: ProjectTaskStatus
  ) => {
    const currentTask = tasks.find((task) => task.id === taskId)

    if (currentTask?.status === nextStatus) {
      return
    }

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: nextStatus } : task
      )
    )

    try {
      const task = await updateProjectTask(taskId, { status: nextStatus })
      setTasks((current) =>
        current.map((item) => (item.id === task.id ? task : item))
      )
    } catch (requestError) {
      setTasks((current) =>
        current.map((task) => (task.id === taskId && currentTask ? currentTask : task))
      )
      throw requestError
    }
  }

  const removeTask = async (taskId: string) => {
    await deleteProjectTask(taskId)
    setTasks((current) => current.filter((task) => task.id !== taskId))
  }

  return {
    tasks,
    filteredTasks,
    taskCounts,
    status,
    setStatus,
    isLoading,
    error,
    reload: loadTasks,
    addTask,
    changeTaskStatus,
    removeTask,
  }
}
