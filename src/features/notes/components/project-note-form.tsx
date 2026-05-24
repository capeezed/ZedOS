import { CheckCircle2, CircleAlert, Plus } from "lucide-react"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ProjectNoteFormProps = {
  onSubmit: (input: { title: string; content: string }) => Promise<void>
}

export function ProjectNoteForm({ onSubmit }: ProjectNoteFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await onSubmit({ title, content })
      setTitle("")
      setContent("")
      setFeedback({ type: "success", message: "Nota criada." })
    } catch (submitError) {
      setFeedback({
        type: "error",
        message:
          submitError instanceof Error
            ? submitError.message
            : "Nao foi possivel criar a nota.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <Input
        required
        placeholder="Titulo rapido"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <textarea
        className="min-h-24 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder="Contexto, decisao, observacao ou proximo passo"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {feedback ? (
          <div
            className={`flex items-center gap-2 text-sm ${
              feedback.type === "success" ? "text-emerald-300" : "text-destructive"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <CircleAlert className="size-4" />
            )}
            {feedback.message}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Capture apenas o que ajuda a retomar o contexto depois.
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          <Plus />
          {isSubmitting ? "Criando..." : "Criar nota"}
        </Button>
      </div>
    </form>
  )
}
