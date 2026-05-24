import { useCallback, useEffect, useState } from "react"

import {
  listActivityEvents,
  listProjectActivityEvents,
} from "../services/activity-service"
import type { ActivityEvent } from "../types/activity-event"

export function useActivityEvents(limit = 12, projectId?: string) {
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEvents = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setEvents(
        projectId
          ? await listProjectActivityEvents(projectId, limit)
          : await listActivityEvents(limit)
      )
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Erro ao carregar atividade"
      )
    } finally {
      setIsLoading(false)
    }
  }, [limit, projectId])

  useEffect(() => {
    // Dashboard activity is synchronized from Supabase on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEvents()
  }, [loadEvents])

  return {
    events,
    isLoading,
    error,
    reload: loadEvents,
  }
}
