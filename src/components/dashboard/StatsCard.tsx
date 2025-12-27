"use client"

import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  iconColor?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = "text-violet-400",
  className,
}: StatsCardProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3 md:p-5 transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/80",
      className
    )}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs md:text-sm font-medium text-zinc-400 truncate">{title}</p>
              <div className={cn(
                "flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-lg flex-shrink-0",
                "bg-zinc-800/50"
              )}>
                <Icon className={cn("h-3 w-3 md:h-4 md:w-4", iconColor)} />
              </div>
            </div>
            <p className="text-lg md:text-2xl font-bold tracking-tight text-white">{value}</p>
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium w-fit",
              trend.isPositive 
                ? "bg-emerald-500/10 text-emerald-400" 
                : "bg-red-500/10 text-red-400"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 md:h-3 md:w-3" />
              )}
              {trend.isPositive ? "+" : ""}{trend.value}%
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="mt-1 md:mt-2 text-[10px] md:text-xs text-zinc-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
