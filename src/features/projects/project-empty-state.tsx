import { FolderOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

type ProjectEmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function ProjectEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: ProjectEmptyStateProps) {
  return (
    <section className="rounded-lg border border-border/70 bg-card/50 p-8 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-muted">
        <FolderOpen className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-4 text-sm font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button className="mt-4" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </section>
  )
}
