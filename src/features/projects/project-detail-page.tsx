import {
  ArrowLeft,
  CalendarClock,
  Code2,
  Loader2,
  Pencil,
  FolderKanban,
  Plus,
  Sparkles,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlaceholderPage } from "@/pages/placeholder"

import { ProjectErrorState } from "./project-error-state"
import { ProjectForm } from "./project-form"
import { ProjectLinkedNotes } from "./project-linked-notes"
import { ProjectPriority } from "./project-priority"
import { ProjectStatusBadge } from "./project-status-badge"
import { useProject } from "./use-projects"

type ProjectDetailPageProps = {
  projectId: string
}

const projectNotes = [
  "Decidir schema inicial antes de criar migrations.",
  "Manter a feature isolada em src/features/projects.",
  "Evitar dependencias novas enquanto o fluxo local ainda esta simples.",
]

const projectSnippets = [
  "npm.cmd run build",
  "npm.cmd run lint",
  "psql -d zedos",
]

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const { project, isLoading, error, saveProject, removeProject } = useProject(projectId)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!project) {
      return
    }

    setIsDeleting(true)
    setDeleteError(null)

    try {
      await removeProject(project.id)
      window.location.href = "/projects"
    } catch (requestError) {
      setDeleteError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel excluir o projeto."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Carregando projeto...
      </div>
    )
  }

  if (error) {
    return (
      <PlaceholderPage
        title="Erro ao carregar projeto"
        description={error}
      />
    )
  }

  if (!project) {
    return (
      <PlaceholderPage
        title="Projeto nao encontrado"
        description="Verifique a URL ou volte para a lista de projetos."
      />
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <section className="flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar para projetos
          </a>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FolderKanban className="size-4 text-primary" />
            <span>Workspace / Projetos / {project.name}</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-normal text-foreground">
                {project.name}
              </h1>
              <ProjectStatusBadge status={project.status} />
              <ProjectPriority priority={project.priority} />
            </div>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Sparkles />
            Capturar contexto
          </Button>
          <Button>
            <Plus />
            Nova nota
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsConfirmingDelete(true)}
          >
            Excluir
          </Button>
        </div>
      </section>

      {isConfirmingDelete && (
        <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">
                Excluir projeto?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Esta acao remove o registro de projects no Supabase. Notas vinculadas devem ser tratadas antes de ativarmos cascade.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsConfirmingDelete(false)
                  setDeleteError(null)
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={() => {
                  void handleDelete()
                }}
              >
                {isDeleting ? "Excluindo..." : "Confirmar exclusao"}
              </Button>
            </div>
          </div>
        </section>
      )}

      {deleteError && <ProjectErrorState message={deleteError} />}

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Area</p>
          <p className="mt-2 text-lg font-semibold">{project.area}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Atualizado</p>
          <p className="mt-2 text-lg font-semibold">{project.updatedAt}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Notas</p>
          <p className="mt-2 text-lg font-semibold">{project.notesCount}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Snippets</p>
          <p className="mt-2 text-lg font-semibold">{project.snippetsCount}</p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-lg bg-card/70 xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pencil className="size-4" />
              Editar projeto
            </CardTitle>
            <CardDescription>
              Atualiza o registro atual na tabela projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectForm
              initialProject={project}
              mode="edit"
              submitLabel="Salvar alteracoes"
              onSubmit={(input) => saveProject(project.id, input)}
            />
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle>Proxima acao</CardTitle>
            <CardDescription>O menor passo util para mover este projeto.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/70 bg-background/40 p-4">
              <p className="text-sm">{project.nextAction}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle>Stack</CardTitle>
            <CardDescription>Contexto tecnico principal.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ProjectLinkedNotes notes={projectNotes} />

        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="size-4" />
              Snippets uteis
            </CardTitle>
            <CardDescription>Comandos e trechos vinculados ao projeto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {projectSnippets.map((snippet) => (
              <div
                key={snippet}
                className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 font-mono text-sm"
              >
                <CalendarClock className="size-3.5 text-muted-foreground" />
                {snippet}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
