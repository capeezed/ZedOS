import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { Bell, Command, Search } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { CommandCenter } from "@/features/search/components/command-center"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        setIsCommandCenterOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="min-h-svh bg-background">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur">
            <SidebarTrigger />

            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                className="hidden h-8 min-w-0 flex-1 max-w-xl items-center gap-2 rounded-lg border border-border/80 bg-muted/30 px-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/50 md:flex"
                type="button"
                onClick={() => setIsCommandCenterOpen(true)}
              >
                <Search className="size-4" />
                <span className="truncate">Buscar projetos, snippets, notas e comandos</span>
                <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  Ctrl K
                </kbd>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Command center"
                onClick={() => setIsCommandCenterOpen(true)}
              >
                <Command />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Notificacoes">
                <Bell />
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 lg:px-6">{children}</main>
        </SidebarInset>

        <CommandCenter
          isOpen={isCommandCenterOpen}
          onOpenChange={setIsCommandCenterOpen}
        />
      </SidebarProvider>
    </TooltipProvider>
  )
}
