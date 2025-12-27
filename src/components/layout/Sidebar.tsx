"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Plus,
  ShoppingCart,
  BarChart3,
  Settings,
  Box,
  Search,
  Zap,
} from "lucide-react"

const mainNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventaire", href: "/inventory", icon: Package },
  { name: "Pokémon", href: "/pokemon", icon: Zap },
  { name: "Ajouter", href: "/add", icon: Plus },
  { name: "Ventes", href: "/sales", icon: ShoppingCart },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800/50 bg-[#0a0a0a]">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <Box className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">ResellHub</span>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 rounded-lg bg-zinc-900/50 px-3 py-2 text-zinc-500 transition-colors hover:bg-zinc-800/50">
            <Search className="h-4 w-4" />
            <span className="text-sm">Rechercher...</span>
            <kbd className="ml-auto rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">⌘K</kbd>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-zinc-800/80 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"
                )} />
                {item.name}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                )}
              </Link>
            )
          })}

          {/* Settings at bottom of nav */}
          <div className="pt-4 border-t border-zinc-800/50 mt-4">
            <Link
              href="/settings"
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/settings"
                  ? "bg-zinc-800/80 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              <Settings className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
              Paramètres
            </Link>
          </div>
        </nav>

      </div>
    </aside>
  )
}
