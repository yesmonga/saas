"use client"

import { ReactNode, useState, useEffect } from "react"
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
  X,
  Menu,
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

// Bottom nav for mobile - most used actions
const bottomNav = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Stock", href: "/inventory", icon: Package },
  { name: "Ajouter", href: "/add", icon: Plus, isMain: true },
  { name: "Pokemon", href: "/pokemon", icon: Zap },
  { name: "Ventes", href: "/sales", icon: ShoppingCart },
]

interface MobileLayoutProps {
  children: ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800/50 bg-[#0a0a0a] hidden md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <Box className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">ResellHub</span>
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

            {/* Settings */}
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

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-zinc-800/50 pt-safe">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white active:scale-95 transition-all"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <Box className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold text-white">ResellHub</span>
          </div>

          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 bg-[#0a0a0a] border-r border-zinc-800/50 transform transition-transform duration-300 ease-out md:hidden safe-area-left",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-800/50 safe-area-top">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <Box className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold text-white">ResellHub</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white active:scale-95 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {mainNav.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all active:scale-[0.98]",
                    isActive
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-violet-400" : "text-zinc-500"
                  )} />
                  {item.name}
                </Link>
              )
            })}

            <div className="pt-4 mt-4 border-t border-zinc-800/50">
              <Link
                href="/settings"
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all active:scale-[0.98]",
                  pathname === "/settings"
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                )}
              >
                <Settings className="h-5 w-5 text-zinc-500" />
                Paramètres
              </Link>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "min-h-screen bg-[#0a0a0a]",
        "pt-header-safe pb-24 md:pt-0 md:pb-0", // Mobile: padding for header + safe area, bottom nav
        "md:ml-64" // Desktop: margin for sidebar
      )}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-zinc-800/50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNav.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))

            if (item.isMain) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center -mt-4"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30 active:scale-95 transition-transform">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                </Link>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-w-[60px] active:scale-95 transition-all",
                  isActive ? "text-violet-400" : "text-zinc-500"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
