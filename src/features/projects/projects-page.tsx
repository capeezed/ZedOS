import { useMemo, useState } from "react"
import { FolderKanban, LayoutGrid, ListFilter, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { ProjectForm } from "./project-form"
import { ProjectCard } from "./project-card"
import { ProjectEmptyState } from "./project-empty-state"
import { ProjectErrorState } from "./project-error-state"
import { ProjectListSkeleton } from "./project-list-skeleton"
import type { ProjectStatus } from "./types"
import { useProjects } from "./use-projects"

const statusFilters: Array<{ label: string; value: ProjectStatus | "all" }> = [
  { label: "Todos", value: "all" },
  { label: "Ativos", value: "active" },
  { label: "Backlog", value: "backlog" },
  { label: "Pausados", value: "paused" },
]

export function ProjectsPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<ProjectStatus | "all">("all")
  const [isCreating, setIsCreating] = useState(false)
  const { projects, isLoading, error, reload, addProject } = useProjects()

  const activeProjects = projects.filter((project) => project.status === "active")

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesStatus = status === "all" || project.status === status
      const searchableText = [
        project.name,
        project.description,
        project.area,
        project.nextAction,
        ...project.stack,
      ]
        .join(" ")
        .toLowerCase()

      return matchesStatus && searchableText.includes(normalizedQuery)
    })
  }, [projects, query, status])

  const clearFilters = () => {
    setQuery("")
    setStatus("all")
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <section className="flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderKanban className="size-4 text-primary" />
            <span>Workspace / Projetos</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-foreground">
              Projetos
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Organize iniciativas, proximas acoes, notas e snippets por contexto de trabalho.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <ListFilter />
            Filtrar
          </Button>
          <Button onClick={() => setIsCreating((current) => !current)}>
            <Plus />
            {isCreating ? "Fechar" : "Novo projeto"}
          </Button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="mt-2 text-2xl font-semibold">{projects.length}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Ativos</p>
          <p className="mt-2 text-2xl font-semibold">{activeProjects.length}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Snippets vinculados</p>
          <p className="mt-2 text-2xl font-semibold">
            {projects.reduce((total, project) => total + project.snippetsCount, 0)}
          </p>
        </div>
      </section>

      {isCreating && (
        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle>Novo projeto</CardTitle>
            <CardDescription>
              Crie um contexto de trabalho com stack, prioridade e proxima acao.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectForm
              mode="create"
              submitLabel="Criar projeto"
              onSubmit={async (input) => {
                await addProject(input)
              }}
            />
          </CardContent>
        </Card>
      )}

      <section className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card/50 p-3 md:flex-row md:items-center">
        <div className="relative min-w-0 flex-1">
          <Input
            placeholder="Buscar por nome, area ou stack"
            className="bg-background/50"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              className={`h-8 rounded-lg border px-3 text-sm transition-colors ${
                status === filter.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background/40 text-muted-foreground hover:bg-muted/50"
              }`}
              type="button"
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {(query || status !== "all") && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X />
            Limpar
          </Button>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LayoutGrid className="size-4" />
          <span>{filteredProjects.length} projetos encontrados</span>
        </div>
      </section>

      {isLoading ? (
        <ProjectListSkeleton />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      )}

      {error && <ProjectErrorState message={error} onRetry={reload} />}

      {!isLoading && filteredProjects.length === 0 && (
        <ProjectEmptyState
          title={projects.length === 0 ? "Nenhum projeto criado" : "Nenhum projeto encontrado"}
          description={
            projects.length === 0
              ? "Crie o primeiro projeto para começar a organizar notas, snippets e contexto tecnico."
              : "Ajuste a busca ou limpe os filtros para voltar a lista completa."
          }
          actionLabel={projects.length === 0 ? "Criar projeto" : "Limpar filtros"}
          onAction={projects.length === 0 ? () => setIsCreating(true) : clearFilters}
        />
      )}
    </div>
  )
}
