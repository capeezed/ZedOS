import { CheckCircle2, CircleAlert } from "lucide-react"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { CreateProjectInput, Project, ProjectPriority, ProjectStatus } from "./types"

type ProjectFormProps = {
  initialProject?: Project
  mode?: "create" | "edit"
  submitLabel: string
  onSubmit: (input: CreateProjectInput) => Promise<void>
}

const defaultInput: CreateProjectInput = {
  name: "",
  description: "",
  status: "backlog",
  priority: "medium",
  area: "",
  stack: [],
  nextAction: "",
}

export function ProjectForm({
  initialProject,
  mode = initialProject ? "edit" : "create",
  submitLabel,
  onSubmit,
}: ProjectFormProps) {
  const [input, setInput] = useState<CreateProjectInput>(
    initialProject
      ? {
          name: initialProject.name,
          description: initialProject.description,
          status: initialProject.status,
          priority: initialProject.priority,
          area: initialProject.area,
          stack: initialProject.stack,
          nextAction: initialProject.nextAction,
        }
      : defaultInput
  )
  const [stackValue, setStackValue] = useState(initialProject?.stack.join(", ") ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null)

  const updateInput = (field: "name" | "description" | "area" | "nextAction", value: string) => {
    setInput((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await onSubmit({
        ...input,
        stack: stackValue
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      })

      if (!initialProject) {
        setInput(defaultInput)
        setStackValue("")
      }

      setFeedback({
        type: "success",
        message:
          mode === "create"
            ? "Projeto criado com sucesso."
            : "Projeto atualizado com sucesso.",
      })
    } catch (submitError) {
      setFeedback({
        type: "error",
        message:
          submitError instanceof Error
            ? submitError.message
            : "Nao foi possivel salvar o projeto.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          required
          placeholder="Nome do projeto"
          value={input.name}
          onChange={(event) => updateInput("name", event.target.value)}
        />
        <Input
          placeholder="Area"
          value={input.area}
          onChange={(event) => updateInput("area", event.target.value)}
        />
      </div>

      <Input
        placeholder="Descricao"
        value={input.description}
        onChange={(event) => updateInput("description", event.target.value)}
      />

      <Input
        placeholder="Stack separada por virgula"
        value={stackValue}
        onChange={(event) => setStackValue(event.target.value)}
      />

      <Input
        placeholder="Proxima acao"
        value={input.nextAction}
        onChange={(event) => updateInput("nextAction", event.target.value)}
      />

      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <select
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={input.status}
          onChange={(event) =>
            setInput((current) => ({
              ...current,
              status: event.target.value as ProjectStatus,
            }))
          }
        >
          <option value="active">Ativo</option>
          <option value="backlog">Backlog</option>
          <option value="paused">Pausado</option>
          <option value="archived">Arquivado</option>
        </select>

        <select
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={input.priority}
          onChange={(event) =>
            setInput((current) => ({
              ...current,
              priority: event.target.value as ProjectPriority,
            }))
          }
        >
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baixa</option>
        </select>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : submitLabel}
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
