import {
  Activity,
  ArrowUpRight,
  Blocks,
  BrainCircuit,
  CheckCircle2,
  Code2,
  FileText,
  FolderKanban,
  GitBranch,
  Plus,
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

const metrics = [
  { label: "Projetos ativos", value: "4", detail: "2 em foco nesta semana" },
  { label: "Snippets salvos", value: "18", detail: "TypeScript, SQL e UI" },
  { label: "Notas tecnicas", value: "9", detail: "Memoria local inicial" },
  { label: "Automacoes", value: "0", detail: "Planejado para fase 4" },
]

const focusItems = [
  "Finalizar shell principal e navegacao",
  "Modelar entidade Project no Prisma",
  "Criar fluxo de snippets reutilizaveis",
]

const recentProjects = [
  {
    name: "ZedOS",
    area: "Developer OS",
    status: "Fase 1",
    icon: FolderKanban,
  },
  {
    name: "API Lab",
    area: "Node + PostgreSQL",
    status: "Backlog",
    icon: GitBranch,
  },
  {
    name: "UI System",
    area: "shadcn + Tailwind",
    status: "Design",
    icon: Blocks,
  },
]

const quickActions = [
  { label: "Novo projeto", icon: Plus },
  { label: "Novo snippet", icon: Code2 },
  { label: "Nova nota", icon: FileText },
  { label: "Contexto IA", icon: BrainCircuit },
]

export function DashboardPage() {
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
              Central de foco para projetos, memoria tecnica, snippets e proximas acoes.
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
            Novo item
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} size="sm" className="rounded-lg bg-card/70">
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {metric.detail}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle>Foco atual</CardTitle>
            <CardDescription>Prioridades da Fase 1 do ZedOS.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {focusItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5"
              >
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle>Acoes rapidas</CardTitle>
            <CardDescription>Entradas frequentes do workflow.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex h-10 items-center gap-3 rounded-lg border border-border/70 bg-background/40 px-3 text-left text-sm transition-colors hover:bg-muted/50"
                type="button"
              >
                <action.icon className="size-4 text-muted-foreground" />
                <span>{action.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="rounded-lg bg-card/70">
          <CardHeader>
            <CardTitle>Projetos recentes</CardTitle>
            <CardDescription>Base visual para a feature de projetos na Fase 2.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <div
                key={project.name}
                className="rounded-lg border border-border/70 bg-background/40 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                    <project.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-medium">{project.name}</h3>
                      <ArrowUpRight className="size-3.5 text-muted-foreground" />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {project.area}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Status</span>
                  <span className="rounded-md border border-border bg-muted/40 px-2 py-1">
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
