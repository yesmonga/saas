"use client"

import { Trophy, TrendingUp, MoreHorizontal } from "lucide-react"

interface TopProduct {
  id: string
  title: string
  category: string
  profit: number
  sales: number
  color: string
}

interface TopProductsProps {
  products: TopProduct[]
}

export function TopProducts({ products }: TopProductsProps) {
  const maxProfit = Math.max(...products.map(p => p.profit), 1)

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Top Produits</h3>
        </div>
        <button className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {products.map((product, index) => {
          const progressPercent = (product.profit / maxProfit) * 100

          return (
            <div 
              key={product.id}
              className="group rounded-lg bg-zinc-800/30 p-3 transition-all hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold"
                  style={{ 
                    backgroundColor: `${product.color}20`,
                    color: product.color 
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {product.title}
                  </p>
                  <p className="text-xs text-zinc-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    €{product.profit.toFixed(0)}
                  </p>
                  <p className="text-xs text-zinc-500">{product.sales} ventes</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-700/50">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundColor: product.color 
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="mb-2 h-8 w-8 text-zinc-600" />
          <p className="text-sm text-zinc-500">Pas encore de données</p>
        </div>
      )}
    </div>
  )
}
