import { useState, type DragEvent } from "react"
import { CheckCircle2, Circle, Loader2, PlayCircle, RotateCw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useProjectTasks } from "../hooks/use-project-tasks"
import type { ProjectTask, ProjectTaskPriority, ProjectTaskStatus } from "../types/project-task"
import { ProjectTaskForm } from "./project-task-form"

type ProjectTasksPanelProps = {
  projectId: string
  onChange?: () => void
}

const statusLabels: Record<ProjectTaskStatus, string> = {
  todo: "Todo",
  doing: "Doing",
  done: "Done",
}

const priorityLabels: Record<ProjectTaskPriority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baixa",
}

const priorityClasses: Record<ProjectTaskPriority, string> = {
  high: "border-red-500/30 bg-red-500/10 text-red-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
}

function renderStatusIcon(status: ProjectTaskStatus) {
  if (status === "done") {
    return <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" />
  }

  if (status === "doing") {
    return <PlayCircle className="size-4 shrink-0 text-muted-foreground" />
  }

  return <Circle className="size-4 shrink-0 text-muted-foreground" />
}

function formatDueDate(value: string | null) {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`))
}

function ProjectTaskItem({
  task,
  onStatusChange,
  onDelete,
}: {
  task: ProjectTask
  onStatusChange: (taskId: string, status: ProjectTaskStatus) => Promise<void>
  onDelete: (taskId: string) => Promise<void>
}) {
  const dueDate = formatDueDate(task.dueDate)

  return (
    <article
      draggable
      className="cursor-grab rounded-lg border border-border/70 bg-background/40 p-3 transition-opacity active:cursor-grabbing"
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("text/plain", task.id)
      }}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {renderStatusIcon(task.status)}
            <h3 className="truncate text-sm font-medium">{task.title}</h3>
          </div>

          {task.description && (
            <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md border border-border bg-muted/30 px-2 py-1">
              {statusLabels[task.status]}
            </span>
            <span
              className={`rounded-md border px-2 py-1 ${priorityClasses[task.priority]}`}
            >
              {priorityLabels[task.priority]}
            </span>
            {dueDate && <span>Prazo {dueDate}</span>}
            <span>Criada {task.createdAt}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {task.status !== "done" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void onStatusChange(task.id, "done")
              }}
            >
              <CheckCircle2 />
              Concluir
            </Button>
          )}

          <select
            className="h-7 rounded-lg border border-input bg-background px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={task.status}
            onChange={(event) => {
              void onStatusChange(task.id, event.target.value as ProjectTaskStatus)
            }}
          >
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Excluir task ${task.title}`}
            onClick={() => {
              void onDelete(task.id)
            }}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </article>
  )
}

export function ProjectTasksPanel({ projectId, onChange }: ProjectTasksPanelProps) {
  const [dragOverStatus, setDragOverStatus] = useState<ProjectTaskStatus | null>(null)
  const {
    tasks,
    filteredTasks,
    taskCounts,
    status,
    setStatus,
    isLoading,
    error,
    reload,
    addTask,
    changeTaskStatus,
    removeTask,
  } = useProjectTasks(projectId)

  const handleAddTask = async (input: Parameters<typeof addTask>[0]) => {
    await addTask(input)
    onChange?.()
  }

  const handleChangeTaskStatus = async (
    taskId: string,
    nextStatus: ProjectTaskStatus
  ) => {
    await changeTaskStatus(taskId, nextStatus)
  }

  const handleRemoveTask = async (taskId: string) => {
    await removeTask(taskId)
    onChange?.()
  }

  const groupedTasks: Record<ProjectTaskStatus, ProjectTask[]> = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    doing: filteredTasks.filter((task) => task.status === "doing"),
    done: filteredTasks.filter((task) => task.status === "done"),
  }

  const handleDragOver = (
    event: DragEvent<HTMLElement>,
    nextStatus: ProjectTaskStatus
  ) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    setDragOverStatus(nextStatus)
  }

  const handleDrop = (
    event: DragEvent<HTMLElement>,
    nextStatus: ProjectTaskStatus
  ) => {
    event.preventDefault()
    const taskId = event.dataTransfer.getData("text/plain")
    setDragOverStatus(null)

    if (taskId) {
      void handleChangeTaskStatus(taskId, nextStatus)
    }
  }

  return (
    <Card className="rounded-lg bg-card/70">
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Tasks operacionais
            </CardTitle>
            <CardDescription>
              Execucao curta vinculada ao contexto deste projeto.
            </CardDescription>
          </div>

          <select
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ProjectTaskStatus | "all")
            }
          >
            <option value="all">Todos status</option>
            <option value="todo">Todo ({taskCounts.todo})</option>
            <option value="doing">Doing ({taskCounts.doing})</option>
            <option value="done">Done ({taskCounts.done})</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ProjectTaskForm onSubmit={handleAddTask} />

        {isLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando tasks...
          </div>
        )}

        {error && (
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive md:flex-row md:items-center md:justify-between">
            <span>{error}</span>
            <Button variant="destructive" size="sm" onClick={reload}>
              <RotateCw />
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && tasks.length === 0 && (
          <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center">
            <p className="text-sm font-medium">Nenhuma task ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Transforme contexto e decisoes em proximos passos executaveis.
            </p>
          </div>
        )}

        {!isLoading && tasks.length > 0 && filteredTasks.length === 0 && (
          <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center">
            <p className="text-sm font-medium">Nenhuma task nesse status</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Troque o filtro para ver as demais tasks do projeto.
            </p>
          </div>
        )}

        <div className="grid gap-3 xl:grid-cols-3">
          {(["todo", "doing", "done"] as ProjectTaskStatus[]).map((groupStatus) => (
            <section
              key={groupStatus}
              className={`min-h-36 rounded-lg border p-2 transition-colors ${
                dragOverStatus === groupStatus
                  ? "border-primary/60 bg-primary/10"
                  : "border-border/70 bg-background/25"
              }`}
              onDragLeave={() => setDragOverStatus(null)}
              onDragOver={(event) => handleDragOver(event, groupStatus)}
              onDrop={(event) => handleDrop(event, groupStatus)}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-sm font-medium">{statusLabels[groupStatus]}</p>
                <span className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground">
                  {groupedTasks[groupStatus].length}
                </span>
              </div>

              <div className="space-y-2">
                {groupedTasks[groupStatus].map((task) => (
                  <ProjectTaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={handleChangeTaskStatus}
                    onDelete={handleRemoveTask}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
