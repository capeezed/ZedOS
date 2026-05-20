import type { ProjectStatus } from "./types"

const statusLabels: Record<ProjectStatus, string> = {
  active: "Ativo",
  paused: "Pausado",
  backlog: "Backlog",
  archived: "Arquivado",
}

const statusStyles: Record<ProjectStatus, string> = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  paused: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  backlog: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  archived: "border-muted bg-muted/40 text-muted-foreground",
}

type ProjectStatusBadgeProps = {
  status: ProjectStatus
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  return (
    <span className={`rounded-md border px-2 py-1 text-xs ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  )
}
