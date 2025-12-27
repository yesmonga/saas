"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Pencil,
  Trash2,
  Copy,
  Zap,
  TrendingUp,
  Package,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Product } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface PokemonSeries {
  id: string
  name: string
  code: string | null
  color: string
  order: number
}

interface SeriesGroup {
  series: string
  seriesData: PokemonSeries | null
  products: Product[]
  isExpanded: boolean
}

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
  const [series, setSeries] = useState<PokemonSeries[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCreateSeriesModal, setShowCreateSeriesModal] = useState(false)
  const [newSeriesName, setNewSeriesName] = useState("")
  const [newSeriesCode, setNewSeriesCode] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, seriesRes] = await Promise.all([
        fetch("/api/products?category=Pokemon"),
        fetch("/api/pokemon-series"),
      ])
      
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }
      
      if (seriesRes.ok) {
        const seriesData = await seriesRes.json()
        setSeries(seriesData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
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

  const handleCreateSeries = async () => {
    if (!newSeriesName.trim()) return

    try {
      const res = await fetch("/api/pokemon-series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSeriesName, code: newSeriesCode || null }),
      })

      if (res.ok) {
        const newSeries = await res.json()
        setSeries([...series, newSeries])
        setNewSeriesName("")
        setNewSeriesCode("")
        setShowCreateSeriesModal(false)
        toast({ title: "Série créée", description: newSeriesName })
      }
    } catch {
      toast({ title: "Erreur", description: "Impossible de créer la série", variant: "destructive" })
    }
  }

  const toggleSeries = (seriesName: string) => {
    const newExpanded = new Set(expandedSeries)
    if (newExpanded.has(seriesName)) {
      newExpanded.delete(seriesName)
    } else {
      newExpanded.add(seriesName)
    }
    setExpandedSeries(newExpanded)
  }

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group products by series
  const groupedBySeries: SeriesGroup[] = (() => {
    const groups: Record<string, Product[]> = {}
    
    filteredProducts.forEach((product) => {
      const seriesName = (product as Product & { pokemonSeries?: string }).pokemonSeries || "Sans série"
      if (!groups[seriesName]) {
        groups[seriesName] = []
      }
      groups[seriesName].push(product)
    })

    return Object.entries(groups)
      .map(([seriesName, prods]) => ({
        series: seriesName,
        seriesData: series.find((s) => s.name === seriesName) || null,
        products: prods,
        isExpanded: expandedSeries.has(seriesName),
      }))
      .sort((a, b) => {
        // Sort by total value (descending)
        const valueA = a.products.reduce((sum, p) => sum + p.purchasePrice, 0)
        const valueB = b.products.reduce((sum, p) => sum + p.purchasePrice, 0)
        return valueB - valueA
      })
  })()

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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Zap className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Collection Pokémon</h1>
            <p className="text-sm md:text-base text-zinc-400">Gérez votre collection par série</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateSeriesModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-zinc-800 text-white text-sm hover:bg-zinc-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvelle série</span>
            <span className="sm:hidden">Série</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-yellow-500 text-black font-medium text-sm hover:bg-yellow-400 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-yellow-500/20">
                <Package className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Total</p>
                <p className="text-lg md:text-2xl font-bold text-white">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-purple-500/20">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Séries</p>
                <p className="text-lg md:text-2xl font-bold text-white">{groupedBySeries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-green-500/20">
                <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Valeur</p>
                <p className="text-lg md:text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-blue-500/20">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-zinc-400">Moyen</p>
                <p className="text-lg md:text-2xl font-bold text-white">
                  {formatCurrency(totalItems > 0 ? totalValue / totalItems : 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Rechercher dans la collection..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-900/50 border-zinc-800"
        />
      </div>

      {/* Series Accordion */}
      {groupedBySeries.length === 0 ? (
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
      ) : (
        <div className="space-y-3">
          {groupedBySeries.map((group) => (
            <Card key={group.series} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
              {/* Series Header */}
              <button
                onClick={() => toggleSeries(group.series)}
                className="w-full flex items-center justify-between p-3 md:p-4 hover:bg-zinc-800/50 transition-colors gap-2"
              >
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  {group.isExpanded ? (
                    <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-zinc-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-zinc-400 flex-shrink-0" />
                  )}
                  <div
                    className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: group.seriesData?.color || "#FFCB05" }}
                  />
                  <span className="font-medium text-white text-sm md:text-base truncate">{group.series}</span>
                  {group.seriesData?.code && (
                    <span className="text-[10px] md:text-xs text-zinc-500 flex-shrink-0">({group.seriesData.code})</span>
                  )}
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                  <span className="text-xs md:text-sm text-zinc-400 hidden sm:block">
                    {formatCurrency(group.products.reduce((sum, p) => sum + p.purchasePrice, 0))}
                  </span>
                  <span className="px-2 py-0.5 md:py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs md:text-sm font-medium whitespace-nowrap">
                    {group.products.length} article{group.products.length > 1 ? "s" : ""}
                  </span>
                </div>
              </button>

              {/* Series Content */}
              {group.isExpanded && (
                <div className="border-t border-zinc-800">
                  {/* Mobile: card layout / Desktop: hidden header */}
                  <div className="hidden md:grid grid-cols-12 border-b border-zinc-800/50 px-3 py-2">
                    <div className="col-span-6 text-xs font-medium text-zinc-500">Produit</div>
                    <div className="col-span-2 text-right text-xs font-medium text-zinc-500">Prix</div>
                    <div className="col-span-4 text-right text-xs font-medium text-zinc-500">Actions</div>
                  </div>
                  
                  <div className="divide-y divide-zinc-800/30">
                    {group.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 hover:bg-zinc-800/20"
                      >
                        {/* Product image */}
                        <div className="h-10 w-10 rounded bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                        
                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm text-white truncate">{product.title}</span>
                          <span className="text-sm font-medium text-yellow-500">
                            {formatCurrency(product.purchasePrice)}
                          </span>
                        </div>
                        
                        {/* Actions - always visible */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleDuplicate(product.id)}
                            className="p-2 rounded text-zinc-400 hover:text-green-400 hover:bg-green-500/10"
                            title="Dupliquer"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/edit/${product.id}`}
                            className="p-2 rounded text-zinc-400 hover:text-white hover:bg-zinc-700"
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Products Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Ajouter des produits Pokémon</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded hover:bg-zinc-800"
                >
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>

              <p className="text-zinc-400 mb-4">Sélectionnez une série pour ajouter des produits :</p>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {series.map((s) => (
                  <Link
                    key={s.id}
                    href={`/add?category=Pokemon&series=${encodeURIComponent(s.name)}`}
                    onClick={() => setShowAddModal(false)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-white">{s.name}</span>
                    {s.code && <span className="text-xs text-zinc-500">({s.code})</span>}
                  </Link>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowAddModal(false)
                  setShowCreateSeriesModal(true)
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Créer une nouvelle série
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Series Modal */}
      {showCreateSeriesModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Créer une nouvelle série</h2>
                <button
                  onClick={() => setShowCreateSeriesModal(false)}
                  className="p-1 rounded hover:bg-zinc-800"
                >
                  <X className="h-5 w-5 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Nom de la série *
                  </label>
                  <Input
                    value={newSeriesName}
                    onChange={(e) => setNewSeriesName(e.target.value)}
                    placeholder="Ex: EV12 Étincelles Déferlantes"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Code (optionnel)
                  </label>
                  <Input
                    value={newSeriesCode}
                    onChange={(e) => setNewSeriesCode(e.target.value)}
                    placeholder="Ex: EV12"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <button
                  onClick={handleCreateSeries}
                  disabled={!newSeriesName.trim()}
                  className="w-full py-3 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Créer la série
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
