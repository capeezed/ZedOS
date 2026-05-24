import { ArrowUpRight, Link2, Loader2, RotateCw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useProjectLinks } from "../hooks/use-project-links"
import { ProjectLinkForm } from "./project-link-form"

type ProjectLinksPanelProps = {
  projectId: string
  onChange?: () => void
}

export function ProjectLinksPanel({ projectId, onChange }: ProjectLinksPanelProps) {
  const {
    links,
    filteredLinks,
    categories,
    category,
    setCategory,
    isLoading,
    error,
    reload,
    addLink,
    removeLink,
  } = useProjectLinks(projectId)

  const handleAddLink = async (input: Parameters<typeof addLink>[0]) => {
    await addLink(input)
    onChange?.()
  }

  const handleRemoveLink = async (linkId: string) => {
    await removeLink(linkId)
    onChange?.()
  }

  return (
    <Card className="rounded-lg bg-card/70">
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="size-4" />
              Links do projeto
            </CardTitle>
            <CardDescription>
              Repositorios, docs, deploys e referencias tecnicas do contexto.
            </CardDescription>
          </div>

          <select
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">Todas categorias</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ProjectLinkForm onSubmit={handleAddLink} />

        {isLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando links...
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

        {!isLoading && links.length === 0 && (
          <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center">
            <p className="text-sm font-medium">Nenhum link ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Salve docs, repositorios, dashboards e referencias que pertencem a este projeto.
            </p>
          </div>
        )}

        {!isLoading && links.length > 0 && filteredLinks.length === 0 && (
          <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center">
            <p className="text-sm font-medium">Nenhum link nessa categoria</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Troque o filtro para ver outras referencias do projeto.
            </p>
          </div>
        )}

        <div className="grid gap-3 xl:grid-cols-2">
          {filteredLinks.map((link) => (
            <article
              key={link.id}
              className="rounded-lg border border-border/70 bg-background/40 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link2 className="size-4 shrink-0 text-muted-foreground" />
                    <h3 className="truncate text-sm font-medium">{link.title}</h3>
                  </div>

                  {link.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md border border-border bg-muted/30 px-2 py-1">
                      {link.category}
                    </span>
                    <span>{link.createdAt}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      <ArrowUpRight />
                      Abrir
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Excluir link ${link.title}`}
                    onClick={() => {
                      void handleRemoveLink(link.id)
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
