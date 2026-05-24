import { ArrowUpRight, FileText, Trash2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import type { ProjectNoteWithProject } from "../types/project-note"

type NoteCardProps = {
  note: ProjectNoteWithProject
  onDelete: (noteId: string) => Promise<void>
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await onDelete(note.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <article className="rounded-lg border border-border/70 bg-card/70 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
              <FileText className="size-4 text-muted-foreground" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium">{note.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {note.project ? (
                  <a
                    href={`/projects/${note.project.slug}`}
                    className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    {note.project.name}
                    <ArrowUpRight className="size-3" />
                  </a>
                ) : (
                  <span>Projeto removido</span>
                )}
                <span>{note.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Excluir nota ${note.title}`}
          disabled={isDeleting}
          onClick={() => void handleDelete()}
        >
          <Trash2 />
        </Button>
      </div>

      <p className="mt-4 line-clamp-5 whitespace-pre-line text-sm leading-6 text-muted-foreground">
        {note.content}
      </p>
    </article>
  )
}
