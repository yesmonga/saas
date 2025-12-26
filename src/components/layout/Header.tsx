"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Bell, User, ChevronRight } from "lucide-react"

interface HeaderProps {
  title?: string
  showAddButton?: boolean
}

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/inventory": "Inventaire",
  "/add": "Ajouter un produit",
  "/sales": "Ventes",
  "/analytics": "Analytics",
  "/settings": "Paramètres",
}

export function Header({ title, showAddButton = true }: HeaderProps) {
  const pathname = usePathname()
  const pageTitle = title || pageTitles[pathname] || "Dashboard"

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">ResellHub</span>
            <ChevronRight className="h-4 w-4 text-zinc-600" />
            <span className="font-medium text-white">{pageTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-500" />
          </button>

          {/* User avatar */}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <User className="h-4 w-4" />
          </button>

          {showAddButton && (
            <Link href="/add">
              <Button size="sm" className="ml-2 gap-1.5 bg-violet-600 hover:bg-violet-700">
                <Plus className="h-4 w-4" />
                Nouveau
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
