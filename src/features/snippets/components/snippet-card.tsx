import { ArrowUpRight, Copy, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import type { ProjectSnippetWithProject } from "../types/project-snippet"

type SnippetCardProps = {
  snippet: ProjectSnippetWithProject
  onDelete: (snippetId: string) => Promise<void>
}

export function SnippetCard({ snippet, onDelete }: SnippetCardProps) {
  const [copyLabel, setCopyLabel] = useState("Copiar")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code)
    setCopyLabel("Copiado")
    window.setTimeout(() => setCopyLabel("Copiar"), 1400)
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await onDelete(snippet.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-lg border border-border/70 bg-card/70">
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium">{snippet.title}</h3>
            <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
              {snippet.language}
            </span>
          </div>

          {snippet.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {snippet.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {snippet.project ? (
              <a
                href={`/projects/${snippet.project.slug}`}
                className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
              >
                {snippet.project.name}
                <ArrowUpRight className="size-3" />
              </a>
            ) : (
              <span>Projeto removido</span>
            )}
            <span>{snippet.createdAt}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => void handleCopy()}>
            <Copy />
            {copyLabel}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Excluir snippet ${snippet.title}`}
            disabled={isDeleting}
            onClick={() => void handleDelete()}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <pre className="max-h-80 overflow-auto border-t border-border/70 bg-black/30 p-4 text-xs leading-relaxed text-foreground">
        <code>{snippet.code}</code>
      </pre>

      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-border/70 p-3">
          {snippet.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
