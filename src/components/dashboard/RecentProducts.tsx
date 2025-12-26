"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils"
import { Eye, Heart } from "lucide-react"
import type { Product } from "@/types"

interface RecentProductsProps {
  products: Product[]
}

export function RecentProducts({ products }: RecentProductsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Produits récents</CardTitle>
        <Link href="/inventory" className="text-sm text-primary hover:underline">
          Voir tout
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 5).map((product) => (
            <Link
              key={product.id}
              href={`/inventory/${product.id}`}
              className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-zinc-800/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800 text-2xl">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-white">{product.title}</p>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span>{formatCurrency(product.sellingPrice)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {product.vintedViews}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {product.vintedFavorites}
                  </span>
                </div>
              </div>
              <Badge className={getStatusColor(product.status)}>
                {getStatusLabel(product.status)}
              </Badge>
            </Link>
          ))}
          {products.length === 0 && (
            <p className="text-center text-sm text-zinc-500 py-8">
              Aucun produit pour le moment
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
