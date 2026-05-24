import { CheckCircle2, CircleAlert, Plus } from "lucide-react"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ProjectSnippetFormProps = {
  onSubmit: (input: {
    title: string
    description: string
    code: string
    language: string
    tags: string[]
  }) => Promise<void>
}

export function ProjectSnippetForm({ onSubmit }: ProjectSnippetFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("typescript")
  const [tagsValue, setTagsValue] = useState("")
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await onSubmit({
        title,
        description,
        code,
        language: language.trim() || "text",
        tags: tagsValue
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      })

      setTitle("")
      setDescription("")
      setLanguage("typescript")
      setTagsValue("")
      setCode("")
      setFeedback({ type: "success", message: "Snippet criado." })
    } catch (submitError) {
      setFeedback({
        type: "error",
        message:
          submitError instanceof Error
            ? submitError.message
            : "Nao foi possivel criar o snippet.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-[1fr_160px]">
        <Input
          required
          placeholder="Titulo do snippet"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          placeholder="Linguagem"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        />
      </div>

      <Input
        placeholder="Descricao curta"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <Input
        placeholder="Tags separadas por virgula"
        value={tagsValue}
        onChange={(event) => setTagsValue(event.target.value)}
      />

      <textarea
        required
        className="min-h-36 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder="Cole comando, helper, query, config ou trecho reutilizavel"
        value={code}
        onChange={(event) => setCode(event.target.value)}
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
            Guarde apenas trechos que voce reutilizaria neste contexto.
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          <Plus />
          {isSubmitting ? "Criando..." : "Criar snippet"}
        </Button>
      </div>
    </form>
  )
}
