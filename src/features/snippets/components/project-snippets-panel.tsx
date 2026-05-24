import { Code2, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useProjectSnippets } from "../hooks/use-project-snippets"
import { ProjectSnippetForm } from "./project-snippet-form"

type ProjectSnippetsPanelProps = {
  projectId: string
}

export function ProjectSnippetsPanel({ projectId }: ProjectSnippetsPanelProps) {
  const {
    filteredSnippets,
    snippets,
    languages,
    language,
    setLanguage,
    isLoading,
    error,
    reload,
    addSnippet,
    removeSnippet,
  } = useProjectSnippets(projectId)

  return (
    <Card className="rounded-lg bg-card/70">
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="size-4" />
              Snippets contextuais
            </CardTitle>
            <CardDescription>
              Solucoes reutilizaveis, comandos e padroes deste projeto.
            </CardDescription>
          </div>

          <select
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="all">Todas linguagens</option>
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ProjectSnippetForm onSubmit={addSnippet} />

        {isLoading && (
          <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando snippets...
          </div>
        )}

        {error && (
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive md:flex-row md:items-center md:justify-between">
            <span>{error}</span>
            <Button variant="destructive" size="sm" onClick={reload}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && snippets.length === 0 && (
          <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center">
            <p className="text-sm font-medium">Nenhum snippet ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Salve comandos, queries, configs ou helpers que resolvem problemas recorrentes.
            </p>
          </div>
        )}

        {!isLoading && snippets.length > 0 && filteredSnippets.length === 0 && (
          <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-6 text-center">
            <p className="text-sm font-medium">Nenhum snippet nessa linguagem</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Troque o filtro para ver os demais snippets do projeto.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filteredSnippets.map((snippet) => (
            <article
              key={snippet.id}
              className="overflow-hidden rounded-lg border border-border/70 bg-background/40"
            >
              <div className="flex items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium">{snippet.title}</h3>
                    <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
                      {snippet.language}
                    </span>
                  </div>
                  {snippet.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {snippet.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {snippet.createdAt}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Excluir snippet ${snippet.title}`}
                  onClick={() => {
                    void removeSnippet(snippet.id)
                  }}
                >
                  <Trash2 />
                </Button>
              </div>

              <pre className="max-h-72 overflow-auto border-t border-border/70 bg-black/30 p-3 text-xs leading-relaxed text-foreground">
                <code>{snippet.code}</code>
              </pre>

              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-t border-border/70 p-3">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
