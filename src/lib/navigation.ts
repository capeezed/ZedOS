import {
  Bot,
  FileText,
  FolderKanban,
  Home,
  Settings,
  TerminalSquare,
  TextSelect,
} from "lucide-react"

export const mainNavigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Projetos",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Notas",
    href: "/notes",
    icon: FileText,
  },
  {
    title: "Snippets",
    href: "/snippets",
    icon: TextSelect,
  },
  {
    title: "IA Contextual",
    href: "/ai",
    icon: Bot,
  },
]

export const systemNavigation = [
  {
    title: "Terminal",
    href: "/terminal",
    icon: TerminalSquare,
  },
  {
    title: "Configuracoes",
    href: "/settings",
    icon: Settings,
  },
]
