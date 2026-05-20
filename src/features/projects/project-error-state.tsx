import { AlertCircle, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"

type ProjectErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ProjectErrorState({ message, onRetry }: ProjectErrorStateProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <AlertCircle className="size-4" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <Button variant="destructive" size="sm" onClick={onRetry}>
          <RotateCw />
          Tentar novamente
        </Button>
      )}
    </section>
  )
}
