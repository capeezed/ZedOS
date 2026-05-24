import { Code2, LayoutGrid, RotateCw, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { SnippetCard } from "../components/snippet-card"
import { useSnippets } from "../hooks/use-snippets"

export function SnippetsPage() {
  const {
    snippets,
    filteredSnippets,
    projects,
    languages,
    query,
    setQuery,
    projectSlug,
    setProjectSlug,
    language,
    setLanguage,
    isLoading,
    error,
    reload,
    removeSnippet,
    clearFilters,
  } = useSnippets()

  const hasFilters = query || projectSlug !== "all" || language !== "all"

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <section className="flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code2 className="size-4 text-primary" />
            <span>Workspace / Snippets</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-foreground">
              Snippets
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Busque comandos, queries, configs e helpers salvos dentro dos projetos.
            </p>
          </div>
        </div>

        <Button variant="outline" onClick={reload}>
          <RotateCw />
          Atualizar
        </Button>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="mt-2 text-2xl font-semibold">{snippets.length}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Projetos</p>
          <p className="mt-2 text-2xl font-semibold">{projects.length}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Linguagens</p>
          <p className="mt-2 text-2xl font-semibold">{languages.length}</p>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card/50 p-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por titulo, codigo, tag, projeto ou linguagem"
            className="bg-background/50 pl-8"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:w-[360px]">
          <select
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={projectSlug}
            onChange={(event) => setProjectSlug(event.target.value)}
          >
            <option value="all">Todos projetos</option>
            {projects.map((project) => (
              <option key={project.slug} value={project.slug}>
                {project.name}
              </option>
            ))}
          </select>

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

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X />
            Limpar
          </Button>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LayoutGrid className="size-4" />
          <span>{filteredSnippets.length} encontrados</span>
        </div>
      </section>

      {error && (
        <section className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive md:flex-row md:items-center md:justify-between">
          <span>{error}</span>
          <Button variant="destructive" size="sm" onClick={reload}>
            Tentar novamente
          </Button>
        </section>
      )}

      {isLoading ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-lg border border-border/70 bg-card/50"
            />
          ))}
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onDelete={removeSnippet}
            />
          ))}
        </section>
      )}

      {!isLoading && filteredSnippets.length === 0 && (
        <section className="rounded-lg border border-border/70 bg-card/50 p-8 text-center">
          <p className="text-sm font-medium">
            {snippets.length === 0 ? "Nenhum snippet salvo" : "Nenhum snippet encontrado"}
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {snippets.length === 0
              ? "Crie snippets dentro de um projeto para manter o conhecimento tecnico contextualizado."
              : "Ajuste os filtros ou a busca para encontrar outros trechos."}
          </p>
        </section>
      )}
    </div>
  )
}
