import { FileText, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ProjectLinkedNotesProps = {
  notes: string[]
}

export function ProjectLinkedNotes({ notes }: ProjectLinkedNotesProps) {
  return (
    <Card className="rounded-lg bg-card/70">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4" />
              Notas vinculadas
            </CardTitle>
            <CardDescription>
              Base preparada para conectar a tabela project_notes.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus />
            Nota
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {notes.map((note) => (
          <div
            key={note}
            className="rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm"
          >
            {note}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
