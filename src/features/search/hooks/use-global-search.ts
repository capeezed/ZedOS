import { useCallback, useEffect, useMemo, useState } from "react"

import { loadGlobalSearchIndex } from "../services/global-search-service"
import type { SearchResult } from "../types/search-result"

const typeWeights: Record<SearchResult["type"], number> = {
  action: 80,
  project: 60,
  activity: 50,
  task: 40,
  link: 38,
  snippet: 35,
  note: 30,
}

function getResultScore(result: SearchResult, query: string) {
  if (!query) {
    const recencyScore = result.createdAt
      ? Math.max(0, 10 - (Date.now() - new Date(result.createdAt).getTime()) / 86_400_000)
      : 0

    return typeWeights[result.type] + recencyScore
  }

  let score = typeWeights[result.type]

  if (result.scoreText.title === query) {
    score += 100
  } else if (result.scoreText.title.startsWith(query)) {
    score += 70
  } else if (result.scoreText.title.includes(query)) {
    score += 45
  }

  if (result.scoreText.body.includes(query)) {
    score += 15
  }

  return score
}

function matchesQuery(result: SearchResult, query: string) {
  if (!query) {
    return true
  }

  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => result.searchableText.includes(term))
}

export function useGlobalSearch(isOpen: boolean) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSearchIndex = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setResults(await loadGlobalSearchIndex())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Erro ao carregar busca")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isOpen || results.length > 0) {
      return
    }

    // Global search reads the current context index from Supabase when opened.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSearchIndex()
  }, [isOpen, loadSearchIndex, results.length])

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return results
      .filter((result) => matchesQuery(result, normalizedQuery))
      .map((result) => ({
        result,
        score: getResultScore(result, normalizedQuery),
      }))
      .sort((a, b) => b.score - a.score)
      .map(({ result }) => result)
      .slice(0, 12)
  }, [query, results])

  return {
    query,
    setQuery,
    results: filteredResults,
    totalResults: results.length,
    isLoading,
    error,
    reload: loadSearchIndex,
  }
}
