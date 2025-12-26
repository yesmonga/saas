"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart"
import { AlertsSection } from "@/components/dashboard/AlertsSection"
import { RecentProducts } from "@/components/dashboard/RecentProducts"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { getCategoryColor } from "@/data/categories"
import { useToast } from "@/hooks/use-toast"
import type { Product, DashboardStats } from "@/types"
import {
  Wallet,
  Package,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Percent,
  PiggyBank,
  Target,
  Download,
  RefreshCw,
} from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      const [statsRes, productsRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/products"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    setImporting(true)
    try {
      const res = await fetch("/api/import", { method: "POST" })
      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Import réussi !",
          description: `${data.results.productsImported} produits importés, ${data.results.amazonOrdersImported} commandes Amazon, ${data.results.salesImported} ventes`,
          variant: "success",
        })
        fetchData()
      } else {
        toast({
          title: "Erreur d'import",
          description: data.error || "Une erreur est survenue",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'importer les données",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find((c) => c.name === product.category)
    if (existing) {
      existing.value++
    } else {
      acc.push({
        name: product.category,
        value: 1,
        color: getCategoryColor(product.category),
      })
    }
    return acc
  }, [] as { name: string; value: number; color: string }[])

  const alerts = []
  const oldStock = products.filter((p) => {
    if (p.status === "sold" || !p.dateHome) return false
    const days = Math.ceil(
      (Date.now() - new Date(p.dateHome).getTime()) / (1000 * 60 * 60 * 24)
    )
    return days > 30
  })

  if (oldStock.length > 0) {
    alerts.push({
      type: "danger" as const,
      message: "Articles en stock depuis plus de 30 jours",
      count: oldStock.length,
    })
  }

  const highFavorites = products.filter(
    (p) => p.status !== "sold" && p.vintedFavorites > 10
  )
  if (highFavorites.length > 0) {
    alerts.push({
      type: "warning" as const,
      message: "Articles avec beaucoup de favoris non vendus",
      count: highFavorites.length,
    })
  }

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      sales: Math.floor(Math.random() * 5),
      revenue: Math.floor(Math.random() * 500),
    }
  })

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <p className="text-zinc-400">Vue d&apos;ensemble de votre activité</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchData}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button
              onClick={handleImport}
              disabled={importing}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {importing ? "Import en cours..." : "Importer Notion"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Valeur du stock"
            value={formatCurrency(stats?.stockValue || 0)}
            icon={Wallet}
            subtitle={`${stats?.inStockCount || 0} articles`}
          />
          <StatsCard
            title="Articles en stock"
            value={String(stats?.inStockCount || 0)}
            icon={Package}
          />
          <StatsCard
            title="Articles vendus"
            value={String(stats?.soldCount || 0)}
            icon={CheckCircle}
            subtitle={`${stats?.soldThisMonth || 0} ce mois`}
          />
          <StatsCard
            title="Chiffre d'affaires"
            value={formatCurrency(stats?.revenue || 0)}
            icon={DollarSign}
            subtitle={`${formatCurrency(stats?.revenueThisMonth || 0)} ce mois`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Bénéfice net"
            value={formatCurrency(stats?.netProfit || 0)}
            icon={TrendingUp}
            trend={stats?.profitThisMonth ? { value: 12, isPositive: true } : undefined}
          />
          <StatsCard
            title="Marge moyenne"
            value={`${(stats?.averageMargin || 0).toFixed(1)}%`}
            icon={Percent}
          />
          <StatsCard
            title="Investissement total"
            value={formatCurrency(stats?.totalInvestment || 0)}
            icon={PiggyBank}
          />
          <StatsCard
            title="ROI"
            value={`${(stats?.roi || 0).toFixed(1)}%`}
            icon={Target}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart data={chartData} />
          <CategoryPieChart data={categoryData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentProducts products={products} />
          </div>
          <AlertsSection alerts={alerts} />
        </div>
      </div>
    </div>
  )
}
