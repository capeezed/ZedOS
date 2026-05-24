import { CheckCircle2, CircleAlert, Plus } from "lucide-react"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type {
  CreateProjectTaskInput,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "../types/project-task"

type ProjectTaskFormProps = {
  onSubmit: (input: Omit<CreateProjectTaskInput, "projectId">) => Promise<void>
}

const defaultInput: Omit<CreateProjectTaskInput, "projectId"> = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: null,
}

export function ProjectTaskForm({ onSubmit }: ProjectTaskFormProps) {
  const [input, setInput] =
    useState<Omit<CreateProjectTaskInput, "projectId">>(defaultInput)
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
      setFeedback({ type: "success", message: "Task criada." })
    } catch (submitError) {
      setFeedback({
        type: "error",
        message:
          submitError instanceof Error
            ? submitError.message
            : "Nao foi possivel criar a task.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <Input
          required
          placeholder="Task"
          value={input.title}
          onChange={(event) =>
            setInput((current) => ({ ...current, title: event.target.value }))
          }
        />
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
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
        <select
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={input.status}
          onChange={(event) =>
            setInput((current) => ({
              ...current,
              status: event.target.value as ProjectTaskStatus,
            }))
          }
        >
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <select
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={input.priority}
          onChange={(event) =>
            setInput((current) => ({
              ...current,
              priority: event.target.value as ProjectTaskPriority,
            }))
          }
        >
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baixa</option>
        </select>

        <Input
          type="date"
          value={input.dueDate ?? ""}
          onChange={(event) =>
            setInput((current) => ({
              ...current,
              dueDate: event.target.value || null,
            }))
          }
        />

        <Button type="submit" disabled={isSubmitting}>
          <Plus />
          {isSubmitting ? "Criando..." : "Criar task"}
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
