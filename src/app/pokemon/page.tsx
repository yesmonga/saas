"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Grid3X3,
  List,
  Pencil,
  Trash2,
  Zap,
  TrendingUp,
  Package,
  DollarSign,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Product } from "@/types"
import { useToast } from "@/hooks/use-toast"

const getFirstPhoto = (photos: string | string[] | undefined): string | null => {
  if (!photos) return null
  if (Array.isArray(photos)) return photos[0] || null
  try {
    const parsed = JSON.parse(photos) as string[]
    return parsed[0] || null
  } catch {
    return null
  }
}

export default function PokemonPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?category=Pokemon")
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch Pokemon products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
        toast({ title: "Produit supprimé" })
      }
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" })
    }
  }

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalValue = filteredProducts.reduce((sum, p) => sum + p.purchasePrice, 0)
  const totalItems = filteredProducts.length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <Zap className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Collection Pokémon</h1>
          <p className="text-zinc-400">Gérez votre collection Pokémon TCG</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Package className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total articles</p>
                <p className="text-2xl font-bold text-white">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Valeur totale</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Prix moyen</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(totalItems > 0 ? totalValue / totalItems : 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Rechercher dans la collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-yellow-500/20 text-yellow-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-yellow-500/20 text-yellow-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="py-16 text-center">
            <Zap className="h-16 w-16 text-yellow-500/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Aucun produit Pokémon</h3>
            <p className="text-zinc-400 mb-4">
              {searchQuery
                ? "Aucun résultat pour votre recherche"
                : "Ajoutez des produits Pokémon à votre inventaire"}
            </p>
            <Link
              href="/add"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition-colors"
            >
              Ajouter un produit
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group bg-zinc-900/50 border-zinc-800 hover:border-yellow-500/50 transition-all overflow-hidden"
            >
              <div className="relative aspect-square bg-zinc-800 flex items-center justify-center overflow-hidden">
                {getFirstPhoto(product.photos) ? (
                  <Image
                    src={getFirstPhoto(product.photos)!}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Zap className="h-12 w-12 text-yellow-500/30" />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Link
                    href={`/edit/${product.id}`}
                    className="p-1.5 rounded-lg bg-zinc-900/90 text-white hover:bg-zinc-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 rounded-lg bg-zinc-900/90 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-white truncate mb-1">{product.title}</h3>
                <p className="text-lg font-bold text-yellow-500">
                  {formatCurrency(product.purchasePrice)}
                </p>
                {product.dateHome && (
                  <p className="text-xs text-zinc-500 mt-1">
                    Reçu le {formatDate(product.dateHome)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-400">Produit</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-400">Prix d&apos;achat</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-400">Date</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                          {getFirstPhoto(product.photos) ? (
                            <Image
                              src={getFirstPhoto(product.photos)!}
                              alt={product.title}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <Zap className="h-5 w-5 text-yellow-500/50" />
                          )}
                        </div>
                        <span className="font-medium text-white">{product.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-yellow-500 font-medium">
                      {formatCurrency(product.purchasePrice)}
                    </td>
                    <td className="p-4 text-right text-zinc-400">
                      {product.dateHome ? formatDate(product.dateHome) : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/edit/${product.id}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
