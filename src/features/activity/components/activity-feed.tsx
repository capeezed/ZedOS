import {
  Activity,
  CheckCircle2,
  Code2,
  FileText,
  FolderKanban,
  Link2,
  Loader2,
  RotateCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { ActivityEvent } from "../types/activity-event"

type ActivityFeedProps = {
  events: ActivityEvent[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  title?: string
  description?: string
}

function getActivityIcon(type: string) {
  if (type.includes("snippet")) {
    return Code2
  }

  if (type.includes("note")) {
    return FileText
  }

  if (type.includes("project")) {
    return FolderKanban
  }

  if (type.includes("task")) {
    return CheckCircle2
  }

  if (type.includes("link")) {
    return Link2
  }

  return Activity
}

export function ActivityFeed({
  events,
  isLoading,
  error,
  onRetry,
  title = "Atividade recente",
  description = "Eventos reais do seu workspace.",
}: ActivityFeedProps) {
  return (
    <Card className="rounded-lg bg-card/70">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando atividade...
          </div>
        )}

        {error && (
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive md:flex-row md:items-center md:justify-between">
            <span>{error}</span>
            <Button variant="destructive" size="sm" onClick={onRetry}>
              <RotateCw />
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center">
            <p className="text-sm font-medium">Nenhuma atividade ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie projetos, notas e snippets para alimentar este feed.
            </p>
          </div>
        )}

        {events.map((event) => {
          const Icon = getActivityIcon(event.type)
          const href = event.projectSlug ? `/projects/${event.projectSlug}` : "/projects"

          return (
            <a
              key={event.id}
              href={href}
              className="flex gap-3 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{event.title}</p>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {event.description || event.projectName || event.type}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {event.createdAt}
                </p>
              </div>
            </a>
          )
        })}
      </CardContent>
    </Card>
  )
}
