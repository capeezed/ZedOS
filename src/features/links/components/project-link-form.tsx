import { CheckCircle2, CircleAlert, Plus } from "lucide-react"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { CreateProjectLinkInput } from "../types/project-link"

type ProjectLinkFormProps = {
  onSubmit: (input: Omit<CreateProjectLinkInput, "projectId">) => Promise<void>
}

const defaultInput: Omit<CreateProjectLinkInput, "projectId"> = {
  title: "",
  url: "",
  description: "",
  category: "reference",
}

export function ProjectLinkForm({ onSubmit }: ProjectLinkFormProps) {
  const [input, setInput] =
    useState<Omit<CreateProjectLinkInput, "projectId">>(defaultInput)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await onSubmit(input)
      setInput(defaultInput)
      setFeedback({ type: "success", message: "Link salvo." })
    } catch (submitError) {
      setFeedback({
        type: "error",
        message:
          submitError instanceof Error
            ? submitError.message
            : "Nao foi possivel salvar o link.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
        <Input
          required
          placeholder="Titulo"
          value={input.title}
          onChange={(event) =>
            setInput((current) => ({ ...current, title: event.target.value }))
          }
        />
        <Input
          required
          placeholder="URL"
          value={input.url}
          onChange={(event) =>
            setInput((current) => ({ ...current, url: event.target.value }))
          }
        />
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <Input
          placeholder="Descricao curta"
          value={input.description}
          onChange={(event) =>
            setInput((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
        />

        <Input
          placeholder="Categoria"
          value={input.category}
          onChange={(event) =>
            setInput((current) => ({
              ...current,
              category: event.target.value || "reference",
            }))
          }
        />

        <Button type="submit" disabled={isSubmitting}>
          <Plus />
          {isSubmitting ? "Salvando..." : "Salvar link"}
        </Button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <CircleAlert className="size-4" />
          )}
          {feedback.message}
        </div>
      )}
    </form>
  )
}
