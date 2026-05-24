import { ActivityFeed } from "./activity-feed"
import { useActivityEvents } from "../hooks/use-activity-events"

type ProjectActivityPanelProps = {
  projectId: string
}

export function ProjectActivityPanel({ projectId }: ProjectActivityPanelProps) {
  const { events, isLoading, error, reload } = useActivityEvents(12, projectId)

  return (
    <ActivityFeed
      events={events}
      isLoading={isLoading}
      error={error}
      onRetry={reload}
      title="Atividade do projeto"
      description="Historico contextual de notas, snippets e alteracoes deste projeto."
    />
  )
}
