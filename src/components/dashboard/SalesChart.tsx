"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"

interface SalesChartProps {
  data: { month: string; sales: number; revenue: number; profit: number }[]
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-xl">
        <p className="mb-2 text-sm font-medium text-white">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="h-2 w-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-zinc-400">{entry.name}:</span>
            <span className="font-medium text-white">
              {entry.name === "Ventes" ? entry.value : `€${entry.value.toFixed(0)}`}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function SalesChart({ data }: SalesChartProps) {
  const [activeMetric, setActiveMetric] = useState<"all" | "revenue" | "profit">("all")

  const metrics = [
    { key: "all", label: "Tout" },
    { key: "revenue", label: "CA" },
    { key: "profit", label: "Profit" },
  ]

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Évolution des ventes</h3>
          <p className="text-sm text-zinc-500">Performance mensuelle</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-zinc-800/50 p-1">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setActiveMetric(metric.key as "all" | "revenue" | "profit")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                activeMetric === metric.key
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#52525B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#52525B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `€${value}`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            {(activeMetric === "all" || activeMetric === "revenue") && (
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                name="Chiffre d'affaires"
              />
            )}
            {(activeMetric === "all" || activeMetric === "profit") && (
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorProfit)"
                name="Profit"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-violet-500" />
          <span className="text-xs text-zinc-400">Chiffre d&apos;affaires</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-zinc-400">Profit</span>
        </div>
      </div>
    </div>
  )
}
