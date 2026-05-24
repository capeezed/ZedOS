import {
  Code2,
  CheckCircle2,
  FileText,
  FolderKanban,
  History,
  Link2,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"

import { useGlobalSearch } from "../hooks/use-global-search"
import type { SearchResultType } from "../types/search-result"

type CommandCenterProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

const resultIcons: Record<SearchResultType, typeof FolderKanban> = {
  project: FolderKanban,
  note: FileText,
  snippet: Code2,
  task: CheckCircle2,
  link: Link2,
  action: Sparkles,
  activity: History,
}

const resultLabels: Record<SearchResultType, string> = {
  project: "Project",
  note: "Note",
  snippet: "Snippet",
  task: "Task",
  link: "Link",
  action: "Action",
  activity: "Recent",
}

export function CommandCenter({ isOpen, onOpenChange }: CommandCenterProps) {
  const { query, setQuery, results, totalResults, isLoading, error, reload } =
    useGlobalSearch(isOpen)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const recentResults = useMemo(
    () => results.filter((result) => result.createdAt).slice(0, 3),
    [results]
  )

  const closeCommandCenter = useCallback(() => {
    setQuery("")
    onOpenChange(false)
  }, [onOpenChange, setQuery])

  const openSelectedResult = useCallback(() => {
    const selectedResult = results[selectedIndex]

    if (selectedResult) {
      window.location.href = selectedResult.href
    }
  }, [results, selectedIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCommandCenter()
      }

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setSelectedIndex((current) =>
          results.length === 0 ? 0 : Math.min(current + 1, results.length - 1)
        )
      }

      if (event.key === "ArrowUp") {
        event.preventDefault()
        setSelectedIndex((current) => Math.max(current - 1, 0))
      }

      if (event.key === "Enter") {
        event.preventDefault()
        openSelectedResult()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, closeCommandCenter, openSelectedResult, results.length])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/70 p-4 backdrop-blur-sm">
      <button
        className="absolute inset-0 cursor-default"
        type="button"
        aria-label="Fechar Command Center"
        onClick={closeCommandCenter}
      />

      <section className="relative mx-auto mt-16 w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
        <div className="flex h-12 items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Buscar projetos, notas, snippets e acoes"
            value={query}
            onChange={(event) => {
              setSelectedIndex(0)
              setQuery(event.target.value)
            }}
          />
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
            Esc
          </kbd>
        </div>

        <div className="max-h-[560px] overflow-auto p-2">
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Indexando contexto...
            </div>
          )}

          {error && (
            <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <span>{error}</span>
              <Button variant="destructive" size="sm" onClick={reload}>
                Tentar novamente
              </Button>
            </div>
          )}

          {!isLoading && !error && results.length === 0 && (
            <div className="px-3 py-8 text-center">
              <p className="text-sm font-medium">Nada encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Busque por projeto, decisao, comando, tag, linguagem ou trecho de codigo.
              </p>
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div className="space-y-1">
              {results.map((result, index) => {
                const ResultIcon = resultIcons[result.type]
                const isSelected = index === selectedIndex

                return (
                  <a
                    key={`${result.type}-${result.id}`}
                    href={result.href}
                    className={`flex gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                      isSelected ? "bg-muted text-foreground" : "hover:bg-muted/60"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <ResultIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium">{result.title}</p>
                        <span className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          {resultLabels[result.type]}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {result.description || result.meta}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {result.meta}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <span>{totalResults} itens indexados</span>
          <span>Use Up/Down para navegar - Enter para abrir</span>
        </div>
      </section>

      {!query && recentResults.length > 0 && (
        <section className="relative mx-auto mt-3 w-full max-w-2xl rounded-lg border border-border bg-card/80 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <History className="size-3.5" />
            Atividade recente
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {recentResults.map((result) => (
              <a
                key={`recent-${result.type}-${result.id}`}
                href={result.href}
                className="rounded-lg border border-border/70 bg-background/40 p-2 text-xs transition-colors hover:bg-muted/50"
              >
                <p className="truncate font-medium">{result.title}</p>
                <p className="mt-1 truncate text-muted-foreground">{result.meta}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
