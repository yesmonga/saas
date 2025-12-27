"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { PieChart as PieChartIcon } from "lucide-react"

interface CategoryPieChartProps {
  data: { name: string; value: number; color: string }[]
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <span className="text-sm font-medium text-white">{payload[0].name}</span>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          {payload[0].value} articles
        </p>
      </div>
    )
  }
  return null
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0)
  // Sort by value descending
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 md:p-5">
      <div className="mb-3 md:mb-4 flex items-center gap-2">
        <PieChartIcon className="h-4 w-4 md:h-5 md:w-5 text-violet-400" />
        <h3 className="text-base md:text-lg font-semibold text-white">Catégories</h3>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative h-[140px] w-[140px] md:h-[180px] md:w-[180px] mx-auto md:mx-0 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl md:text-2xl font-bold text-white">{total}</span>
            <span className="text-[10px] md:text-xs text-zinc-500">articles</span>
          </div>
        </div>

        {/* Legend - show all categories */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-1 gap-1.5 md:gap-2">
          {sortedData.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div 
                  className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs md:text-sm text-zinc-400 truncate">{item.name}</span>
              </div>
              <span className="text-xs md:text-sm font-medium text-white flex-shrink-0">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
