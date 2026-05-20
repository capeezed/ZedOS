import { ArrowUpRight, FileText, ScissorsLineDashed } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ProjectPriority } from "./project-priority"
import { ProjectStatusBadge } from "./project-status-badge"
import type { Project } from "./types"

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a href={`/projects/${project.slug}`} className="block">
      <Card className="h-full rounded-lg bg-card/70 transition-colors hover:bg-card">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="truncate">{project.name}</CardTitle>
              <CardDescription className="mt-1">{project.area}</CardDescription>
            </div>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="rounded-lg border border-border/70 bg-background/40 p-3">
            <p className="text-xs text-muted-foreground">Proxima acao</p>
            <p className="mt-1 text-sm">{project.nextAction}</p>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-3.5" />
                {project.notesCount}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ScissorsLineDashed className="size-3.5" />
                {project.snippetsCount}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ProjectPriority priority={project.priority} />
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
