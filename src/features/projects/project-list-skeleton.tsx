export function ProjectListSkeleton() {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-lg border border-border/70 bg-card/50"
        />
      ))}
    </section>
  )
}
