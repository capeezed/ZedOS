import { AppShell } from "@/layouts/app-shell"
import { ProjectDetailPage } from "@/features/projects/project-detail-page"
import { ProjectsPage } from "@/features/projects/projects-page"
import { DashboardPage } from "@/pages/dashboard"
import { PlaceholderPage } from "@/pages/placeholder"

function getCurrentPage() {
  const pathname = window.location.pathname
  const projectDetailMatch = pathname.match(/^\/projects\/([^/]+)$/)

  if (projectDetailMatch) {
    return <ProjectDetailPage projectId={projectDetailMatch[1]} />
  }

  if (pathname === "/projects") {
    return <ProjectsPage />
  }

  if (pathname === "/notes") {
    return (
      <PlaceholderPage
        title="Notas"
        description="A proxima etapa sera conectar notas tecnicas aos projetos."
      />
    )
  }

  if (pathname === "/snippets") {
    return (
      <PlaceholderPage
        title="Snippets"
        description="Aqui ficara a biblioteca pessoal de comandos, trechos e padroes reutilizaveis."
      />
    )
  }

  if (pathname === "/ai") {
    return (
      <PlaceholderPage
        title="IA Contextual"
        description="A camada de IA vai usar projetos, notas e snippets como memoria de trabalho."
      />
    )
  }

  if (pathname === "/terminal" || pathname === "/settings") {
    return (
      <PlaceholderPage
        title="Sistema"
        description="Configuracoes e ferramentas internas entram depois da base de workflow."
      />
    )
  }

  return <DashboardPage />
}

export default function App() {
  return (
    <AppShell>
      {getCurrentPage()}
    </AppShell>
  )
}
