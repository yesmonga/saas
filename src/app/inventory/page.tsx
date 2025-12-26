"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency, getStatusColor, getStatusLabel, formatDate, getMarginColor } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"
import {
  Search,
  Grid3X3,
  List,
  Eye,
  Heart,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react"

const statuses = [
  { value: "all", label: "Tous les statuts" },
  { value: "draft", label: "Brouillon" },
  { value: "in_stock", label: "En stock" },
  { value: "listed", label: "En vente" },
  { value: "reserved", label: "Réservé" },
  { value: "sold", label: "Vendu" },
]

const categories = [
  { value: "all", label: "Toutes les catégories" },
  { value: "Pokemon", label: "Pokemon" },
  { value: "Pop Mart", label: "Pop Mart" },
  { value: "Sneakers", label: "Sneakers" },
  { value: "Figurines & Collectibles", label: "Figurines & Collectibles" },
  { value: "Vêtements", label: "Vêtements" },
  { value: "Accessoires", label: "Accessoires" },
  { value: "Autres", label: "Autres" },
]

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      if (search) params.set("search", search)

      const res = await fetch(`/api/products?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, categoryFilter, search])

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès",
          variant: "success",
        })
        fetchProducts()
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = products

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Inventaire" showAddButton />
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
          </p>
          <Link href="/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </Link>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <div className="relative aspect-square bg-zinc-800 flex items-center justify-center text-6xl">
                  📦
                  <Badge className={`absolute top-3 right-3 ${getStatusColor(product.status)}`}>
                    {getStatusLabel(product.status)}
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-white truncate">{product.title}</h3>
                    <p className="text-sm text-zinc-400">{product.category}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(product.sellingPrice)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Achat: {formatCurrency(product.purchasePrice)}
                      </p>
                    </div>
                    <div className={`text-right ${getMarginColor(product.marginPercent)}`}>
                      <p className="font-semibold">
                        {product.margin >= 0 ? "+" : ""}{formatCurrency(product.margin)}
                      </p>
                      <p className="text-xs">
                        {product.marginPercent >= 0 ? "+" : ""}{product.marginPercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {product.vintedViews}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {product.vintedFavorites}
                    </span>
                    <span className="text-xs">
                      {formatDate(product.createdAt)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/edit/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <Pencil className="h-3 w-3" />
                        Éditer
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-400"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">Produit</th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">Catégorie</th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">Achat</th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">Vente</th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">Marge</th>
                    <th className="text-center p-4 text-sm font-medium text-zinc-400">Stats</th>
                    <th className="text-center p-4 text-sm font-medium text-zinc-400">Statut</th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-lg">
                            📦
                          </div>
                          <span className="font-medium text-white">{product.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400">{product.category}</td>
                      <td className="p-4 text-right text-zinc-400">
                        {formatCurrency(product.purchasePrice)}
                      </td>
                      <td className="p-4 text-right text-white font-medium">
                        {formatCurrency(product.sellingPrice)}
                      </td>
                      <td className={`p-4 text-right font-medium ${getMarginColor(product.marginPercent)}`}>
                        {product.margin >= 0 ? "+" : ""}{formatCurrency(product.margin)}
                        <span className="text-xs ml-1">
                          ({product.marginPercent >= 0 ? "+" : ""}{product.marginPercent.toFixed(1)}%)
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {product.vintedViews}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {product.vintedFavorites}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge className={getStatusColor(product.status)}>
                          {getStatusLabel(product.status)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/edit/${product.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-400"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
            <p className="text-zinc-400 mb-4">
              {search || statusFilter !== "all" || categoryFilter !== "all"
                ? "Essayez de modifier vos filtres"
                : "Commencez par ajouter votre premier produit"}
            </p>
            <Link href="/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
