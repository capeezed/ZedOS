import { FileText, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useProjectNotes } from "../hooks/use-project-notes"
import { ProjectNoteForm } from "./project-note-form"

type ProjectNotesPanelProps = {
  projectId: string
  onChange?: () => void
}

export function ProjectNotesPanel({ projectId, onChange }: ProjectNotesPanelProps) {
  const { notes, isLoading, error, reload, addNote, removeNote } =
    useProjectNotes(projectId)

  const handleAddNote = async (input: Parameters<typeof addNote>[0]) => {
    await addNote(input)
    onChange?.()
  }

  const handleRemoveNote = async (noteId: string) => {
    await removeNote(noteId)
    onChange?.()
  }

  return (
    <Card className="rounded-lg bg-card/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4" />
          Notas operacionais
        </CardTitle>
        <CardDescription>
          Memoria curta e util vinculada a este projeto.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <ProjectNoteForm onSubmit={handleAddNote} />

        {isLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando notas...
          </div>
        )}

        {error && (
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive md:flex-row md:items-center md:justify-between">
            <span>{error}</span>
            <Button variant="destructive" size="sm" onClick={reload}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && notes.length === 0 && (
          <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center">
            <p className="text-sm font-medium">Nenhuma nota ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Registre decisoes, comandos importantes ou contexto que voce nao quer reconstruir.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-lg border border-border/70 bg-background/40 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-medium">{note.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{note.createdAt}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Excluir nota ${note.title}`}
                  onClick={() => {
                    void handleRemoveNote(note.id)
                  }}
                >
                  <Trash2 />
                </Button>
              </div>

              {note.content && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                  {note.content}
                </p>
              )}
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
