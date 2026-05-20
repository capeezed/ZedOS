import type { ProjectPriority } from "./types"

const priorityLabels: Record<ProjectPriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baixa",
}

const priorityDots: Record<ProjectPriority, string> = {
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-muted-foreground",
}

type ProjectPriorityProps = {
  priority: ProjectPriority
}

export function ProjectPriority({ priority }: ProjectPriorityProps) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className={`size-2 rounded-full ${priorityDots[priority]}`} />
      {priorityLabels[priority]}
    </span>
  )
}
