"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Copy,
  ImageIcon,
  ChevronDown,
  ChevronRight,
  Package,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"

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

const categoryColors: Record<string, string> = {
  "Pokemon": "#FFCB05",
  "Pop Mart": "#FF6B9D",
  "Sneakers": "#4ECDC4",
  "Lorcana": "#1ABC9C",
  "Mattel": "#E74C3C",
  "Funko": "#9B59B6",
  "Accessoires": "#E67E22",
  "Vêtements": "#3498DB",
  "Autres": "#95A5A6",
}

interface CategoryGroup {
  category: string
  products: Product[]
  isExpanded: boolean
}

// Group similar products together
const groupSimilarProducts = (products: Product[]): Product[] => {
  const sorted = [...products].sort((a, b) => {
    // First sort by title similarity
    const titleA = a.title.toLowerCase().replace(/[^a-z0-9]/g, '')
    const titleB = b.title.toLowerCase().replace(/[^a-z0-9]/g, '')
    return titleA.localeCompare(titleB)
  })
  return sorted
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      params.set("status", "in_stock")
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
  }, [search])

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

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}/duplicate`, { method: "POST" })
      if (res.ok) {
        const newProduct = await res.json()
        setProducts([...products, newProduct])
        toast({ title: "Produit dupliqué", description: "Le produit a été dupliqué avec succès" })
      }
    } catch {
      toast({ title: "Erreur", description: "Impossible de dupliquer", variant: "destructive" })
    }
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Group products by category (excluding Pokemon)
  const groupedByCategory: CategoryGroup[] = (() => {
    const groups: Record<string, Product[]> = {}
    
    products.forEach((product) => {
      const cat = product.category || "Autres"
      // Exclude Pokemon category - it has its own dedicated page
      if (cat === "Pokemon") return
      if (!groups[cat]) {
        groups[cat] = []
      }
      groups[cat].push(product)
    })

    // Sort categories by total value (descending)
    return Object.entries(groups)
      .map(([category, prods]) => ({
        category,
        products: groupSimilarProducts(prods),
        isExpanded: expandedCategories.has(category),
      }))
      .sort((a, b) => {
        const valueA = a.products.reduce((sum, p) => sum + p.purchasePrice, 0)
        const valueB = b.products.reduce((sum, p) => sum + p.purchasePrice, 0)
        return valueB - valueA
      })
  })()

  // Calculate totals excluding Pokemon
  const nonPokemonProducts = products.filter(p => p.category !== "Pokemon")
  const totalValue = nonPokemonProducts.reduce((sum, p) => sum + p.purchasePrice, 0)
  const totalItems = nonPokemonProducts.length

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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total articles</p>
                  <p className="text-2xl font-bold text-white">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Catégories</p>
                  <p className="text-2xl font-bold text-white">{groupedByCategory.length}</p>
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

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
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

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-zinc-900/50 border-zinc-800"
            />
          </div>
          <Link href="/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </Link>
        </div>

        {/* Categories Accordion */}
        {groupedByCategory.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
            <p className="text-zinc-400 mb-4">
              {search
                ? "Essayez de modifier votre recherche"
                : "Commencez par ajouter votre premier produit"}
            </p>
            <Link href="/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {groupedByCategory.map((group) => (
              <Card key={group.category} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(group.category)}
                  className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {group.isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-zinc-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-zinc-400" />
                    )}
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[group.category] || "#95A5A6" }}
                    />
                    <span className="font-medium text-white">{group.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-400">
                      {formatCurrency(group.products.reduce((sum, p) => sum + p.purchasePrice, 0))}
                    </span>
                    <span 
                      className="px-2 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${categoryColors[group.category] || "#95A5A6"}20`,
                        color: categoryColors[group.category] || "#95A5A6"
                      }}
                    >
                      {group.products.length} article{group.products.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </button>

                {/* Category Content */}
                {group.isExpanded && (
                  <div className="border-t border-zinc-800">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800/50">
                          <th className="text-left p-3 text-xs font-medium text-zinc-500">Produit</th>
                          <th className="text-right p-3 text-xs font-medium text-zinc-500">Prix</th>
                          <th className="text-right p-3 text-xs font-medium text-zinc-500">Date</th>
                          <th className="text-right p-3 text-xs font-medium text-zinc-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.products.map((product, index) => {
                          // Check if this product is similar to the previous one
                          const prevProduct = index > 0 ? group.products[index - 1] : null
                          const isSimilar = prevProduct && 
                            product.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20) === 
                            prevProduct.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)
                          
                          return (
                            <tr
                              key={product.id}
                              className={`border-b border-zinc-800/30 hover:bg-zinc-800/20 ${isSimilar ? 'bg-zinc-800/10' : ''}`}
                            >
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  {isSimilar && <div className="w-4" />}
                                  <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {getFirstPhoto(product.photos) ? (
                                      <Image
                                        src={getFirstPhoto(product.photos)!}
                                        alt={product.title}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                      />
                                    ) : (
                                      <ImageIcon className="h-4 w-4 text-zinc-600" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-sm text-white">{product.title}</span>
                                    {product.subcategory && (
                                      <span className="ml-2 text-xs text-zinc-500">({product.subcategory})</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-right text-sm font-medium" style={{ color: categoryColors[group.category] || "#95A5A6" }}>
                                {formatCurrency(product.purchasePrice)}
                              </td>
                              <td className="p-3 text-right text-zinc-500 text-sm">
                                {product.purchaseDate ? formatDate(product.purchaseDate) : "-"}
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleDuplicate(product.id)}
                                    className="p-1.5 rounded text-zinc-400 hover:text-green-400 hover:bg-green-500/10"
                                    title="Dupliquer"
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </button>
                                  <Link
                                    href={`/edit/${product.id}`}
                                    className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-700"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
