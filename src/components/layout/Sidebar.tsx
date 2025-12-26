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
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventaire", href: "/inventory", icon: Package },
  { name: "Ajouter", href: "/add", icon: Plus },
  { name: "Ventes", href: "/sales", icon: ShoppingCart },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Paramètres", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800 bg-zinc-950">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Box className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">ResellHub</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <div className="rounded-xl bg-zinc-900 p-4">
            <p className="text-xs text-zinc-500">Version</p>
            <p className="text-sm font-medium text-zinc-300">1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
