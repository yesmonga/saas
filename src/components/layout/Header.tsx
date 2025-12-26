"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Moon, Sun, Bell } from "lucide-react"

interface HeaderProps {
  title?: string
  showSearch?: boolean
  showAddButton?: boolean
}

export function Header({ title, showSearch = true, showAddButton = true }: HeaderProps) {
  const [isDark, setIsDark] = useState(true)

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">
              {title || "Bonjour Alex 👋"}
            </h1>
            <p className="text-sm text-zinc-500 capitalize">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Rechercher..."
                className="w-64 pl-9"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {showAddButton && (
            <Link href="/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
