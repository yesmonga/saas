"use client"

import Link from "next/link"
import { formatCurrency, getStatusLabel } from "@/lib/utils"
import { Package, ArrowRight, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

interface RecentProductsProps {
  products: Product[]
}

export function RecentProducts({ products }: RecentProductsProps) {
  const inStockProducts = products.filter(p => p.status === "in_stock").slice(0, 6)

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Inventaire récent</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
            <Search className="h-3 w-3" />
            Rechercher
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
            <Filter className="h-3 w-3" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Table Header - hidden on mobile */}
      <div className="mb-2 hidden md:grid grid-cols-12 gap-4 px-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
        <div className="col-span-5">Produit</div>
        <div className="col-span-2">Catégorie</div>
        <div className="col-span-2 text-right">Prix</div>
        <div className="col-span-3 text-right">Statut</div>
      </div>

      {/* Table Body */}
      <div className="space-y-1">
        {inStockProducts.map((product) => (
          <Link
            key={product.id}
            href={`/edit/${product.id}`}
            className="group flex md:grid md:grid-cols-12 items-center gap-3 md:gap-4 rounded-lg px-3 py-2.5 transition-all hover:bg-zinc-800/50"
          >
            {/* Mobile: row layout / Desktop: grid */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-lg">
              📦
            </div>
            <div className="flex-1 md:col-span-5 md:flex md:items-center md:gap-3 min-w-0">
              <span className="block truncate text-sm font-medium text-white group-hover:text-violet-400">
                {product.title}
              </span>
              {/* Mobile: category under title */}
              <span className="block md:hidden text-xs text-zinc-500 truncate">{product.category}</span>
            </div>
            {/* Desktop only: category column */}
            <div className="hidden md:block md:col-span-2">
              <span className="text-xs text-zinc-500">{product.category}</span>
            </div>
            {/* Price - always visible */}
            <div className="text-right md:col-span-2 shrink-0">
              <span className="text-sm font-medium text-white">
                {formatCurrency(product.sellingPrice)}
              </span>
            </div>
            {/* Status badge */}
            <div className="md:col-span-3 flex justify-end shrink-0">
              <span className={cn(
                "rounded-full px-2 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs font-medium whitespace-nowrap",
                product.status === "in_stock" && "bg-emerald-500/10 text-emerald-400",
                product.status === "sold" && "bg-blue-500/10 text-blue-400",
                product.status === "listed" && "bg-amber-500/10 text-amber-400",
                product.status === "reserved" && "bg-purple-500/10 text-purple-400",
              )}>
                {getStatusLabel(product.status)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {inStockProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="mb-2 h-8 w-8 text-zinc-600" />
          <p className="text-sm text-zinc-500">Aucun produit en stock</p>
        </div>
      )}

      {/* View All Link */}
      <Link
        href="/inventory"
        className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-zinc-800 py-2.5 text-sm text-zinc-400 transition-all hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-white"
      >
        Voir tout l&apos;inventaire
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
