import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  FileText,
  FolderKanban,
  Loader2,
  Plus,
  RotateCw,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ActivityFeed } from "@/features/activity/components/activity-feed"
import { useActivityEvents } from "@/features/activity/hooks/use-activity-events"
import { useDashboardContext } from "@/features/activity/hooks/use-dashboard-context"
import { useDashboardSummary } from "@/features/activity/hooks/use-dashboard-summary"

const quickActions = [
  { label: "Novo projeto", href: "/projects", icon: Plus },
  { label: "Snippets", href: "/snippets", icon: Code2 },
  { label: "Notas", href: "/notes", icon: FileText },
  { label: "Contexto IA", href: "/ai", icon: BrainCircuit },
]

export function DashboardPage() {
  const {
    summary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useDashboardSummary()
  const {
    events,
    isLoading: isActivityLoading,
    error: activityError,
    reload: reloadActivity,
  } = useActivityEvents(8)
  const {
    context,
    isLoading: isContextLoading,
    error: contextError,
    reload: reloadContext,
  } = useDashboardContext()

  const metrics = [
    {
      label: "Projetos",
      value: summary.projectsCount,
      detail: `${summary.activeProjectsCount} ativos`,
    },
    {
      label: "Snippets",
      value: summary.snippetsCount,
      detail: "Conhecimento tecnico reutilizavel",
    },
    {
      label: "Notas",
      value: summary.notesCount,
      detail: "Memoria operacional registrada",
    },
    {
      label: "Tasks",
      value: summary.tasksCount,
      detail: "Execucao conectada ao contexto",
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <section className="flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="size-4 text-primary" />
            <span>Workspace pessoal</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Central viva de projetos, memoria tecnica, snippets e atividade recente.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Sparkles />
            Capturar contexto
          </Button>
          <Button asChild>
            <a href="/projects">
              <Plus />
              Novo item
            </a>
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} size="sm" className="rounded-lg bg-card/70">
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">
                {isSummaryLoading ? "..." : metric.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {metric.detail}
            </CardContent>
          </Card>
        ))}
      </section>

      {summaryError && (
        <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {summaryError}
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <ActivityFeed
          events={events}
          isLoading={isActivityLoading}
          error={activityError}
          onRetry={reloadActivity}
        />

        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle>Acoes rapidas</CardTitle>
            <CardDescription>Entradas frequentes do workflow.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action) => (
              <a
                key={action.label}
                className="flex h-10 items-center gap-3 rounded-lg border border-border/70 bg-background/40 px-3 text-left text-sm transition-colors hover:bg-muted/50"
                href={action.href}
              >
                <action.icon className="size-4 text-muted-foreground" />
                <span>{action.label}</span>
              </a>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-4">
        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="size-4" />
              Projetos recentes
            </CardTitle>
            <CardDescription>Contextos atualizados por ultimo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isContextLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Carregando projetos...
              </div>
            )}

            {!isContextLoading &&
              context.recentProjects.map((project) => (
                <a
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="block rounded-lg border border-border/70 bg-background/40 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{project.name}</p>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" />
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {project.nextAction || project.description || project.area}
                  </p>
                </a>
              ))}

            {!isContextLoading && context.recentProjects.length === 0 && (
              <p className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center text-sm text-muted-foreground">
                Nenhum projeto recente.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4" />
              Ultimas notas
            </CardTitle>
            <CardDescription>Memoria operacional recuperavel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isContextLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Carregando notas...
              </div>
            )}

            {!isContextLoading &&
              context.recentNotes.map((note) => (
                <a
                  key={note.id}
                  href={note.project ? `/projects/${note.project.slug}` : "/notes"}
                  className="block rounded-lg border border-border/70 bg-background/40 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{note.title}</p>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" />
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {note.project?.name ?? "Projeto removido"} - {note.content}
                  </p>
                </a>
              ))}

            {!isContextLoading && context.recentNotes.length === 0 && (
              <p className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center text-sm text-muted-foreground">
                Nenhuma nota recente.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="size-4" />
              Ultimos snippets
            </CardTitle>
            <CardDescription>Conhecimento tecnico pronto para reutilizar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isContextLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Carregando snippets...
              </div>
            )}

            {!isContextLoading &&
              context.recentSnippets.map((snippet) => (
                <a
                  key={snippet.id}
                  href={snippet.project ? `/projects/${snippet.project.slug}` : "/snippets"}
                  className="block rounded-lg border border-border/70 bg-background/40 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{snippet.title}</p>
                    <span className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {snippet.language}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {snippet.project?.name ?? "Projeto removido"} -{" "}
                    {snippet.description || snippet.code}
                  </p>
                </a>
              ))}

            {!isContextLoading && context.recentSnippets.length === 0 && (
              <p className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center text-sm text-muted-foreground">
                Nenhum snippet recente.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Tasks recentes
            </CardTitle>
            <CardDescription>Proximos passos criados no workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isContextLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Carregando tasks...
              </div>
            )}

            {!isContextLoading &&
              context.recentTasks.map((task) => (
                <a
                  key={task.id}
                  href={task.project ? `/projects/${task.project.slug}` : "/projects"}
                  className="block rounded-lg border border-border/70 bg-background/40 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <span className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {task.project?.name ?? "Projeto removido"} -{" "}
                    {task.description || task.priority}
                  </p>
                </a>
              ))}

            {!isContextLoading && context.recentTasks.length === 0 && (
              <p className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center text-sm text-muted-foreground">
                Nenhuma task recente.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {contextError && (
        <section className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive md:flex-row md:items-center md:justify-between">
          <span>{contextError}</span>
          <Button variant="destructive" size="sm" onClick={reloadContext}>
            <RotateCw />
            Tentar novamente
          </Button>
        </section>
      )}

      <section>
        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle>Contexto operacional</CardTitle>
            <CardDescription>
              O ZedOS agora registra atividade real a partir do seu uso.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-background/40 p-3">
              <FolderKanban className="size-4 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">Projetos como containers</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Cada projeto concentra notas, snippets e proximas decisoes.
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-background/40 p-3">
              <FileText className="size-4 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">Notas como memoria</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Decisoes e contexto ficam persistidos onde foram gerados.
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-background/40 p-3">
              <Code2 className="size-4 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">Snippets como conhecimento</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Comandos e solucoes tecnicas viram material reutilizavel.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
