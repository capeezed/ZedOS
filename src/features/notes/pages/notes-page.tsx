import { FileText, LayoutGrid, RotateCw, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { NoteCard } from "../components/note-card"
import { useNotes } from "../hooks/use-notes"

export function NotesPage() {
  const {
    notes,
    filteredNotes,
    projects,
    query,
    setQuery,
    projectSlug,
    setProjectSlug,
    isLoading,
    error,
    reload,
    removeNote,
    clearFilters,
  } = useNotes()

  const hasFilters = query || projectSlug !== "all"

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <section className="flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4 text-primary" />
            <span>Workspace / Notas</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-foreground">
              Notas
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Recupere decisoes, observacoes e contexto tecnico salvos dentro dos projetos.
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
          <p className="mt-2 text-2xl font-semibold">{notes.length}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Projetos</p>
          <p className="mt-2 text-2xl font-semibold">{projects.length}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-card/70 p-4">
          <p className="text-sm text-muted-foreground">Encontradas</p>
          <p className="mt-2 text-2xl font-semibold">{filteredNotes.length}</p>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card/50 p-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por titulo, conteudo ou projeto"
            className="bg-background/50 pl-8"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <select
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 xl:w-56"
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

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X />
            Limpar
          </Button>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LayoutGrid className="size-4" />
          <span>{filteredNotes.length} encontradas</span>
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
              className="h-48 animate-pulse rounded-lg border border-border/70 bg-card/50"
            />
          ))}
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={removeNote} />
          ))}
        </section>
      )}

      {!isLoading && filteredNotes.length === 0 && (
        <section className="rounded-lg border border-border/70 bg-card/50 p-8 text-center">
          <p className="text-sm font-medium">
            {notes.length === 0 ? "Nenhuma nota salva" : "Nenhuma nota encontrada"}
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {notes.length === 0
              ? "Crie notas dentro de um projeto para registrar contexto operacional."
              : "Ajuste os filtros ou a busca para encontrar outro contexto."}
          </p>
        </section>
      )}
    </div>
  )
}
