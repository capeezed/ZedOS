import { Construction } from "lucide-react"

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <section className="flex min-h-[360px] items-center justify-center rounded-lg border border-border/70 bg-card/50 p-8">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-muted">
            <Construction className="size-5 text-muted-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </section>
    </div>
  )
}
