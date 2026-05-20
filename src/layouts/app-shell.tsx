import type { ReactNode } from "react"
import { Bell, Command, Search } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
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
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="min-h-svh bg-background">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur">
            <SidebarTrigger />

            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="hidden h-8 min-w-0 flex-1 max-w-xl items-center gap-2 rounded-lg border border-border/80 bg-muted/30 px-2.5 text-sm text-muted-foreground md:flex">
                <Search className="size-4" />
                <span className="truncate">Buscar projetos, snippets, notas e comandos</span>
                <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  Ctrl K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Command center">
                <Command />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Notificacoes">
                <Bell />
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 lg:px-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
