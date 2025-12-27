"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart"
import { TopProducts } from "@/components/dashboard/TopProducts"
import { RecentProducts } from "@/components/dashboard/RecentProducts"
import { formatCurrency } from "@/lib/utils"
import { getCategoryColor } from "@/data/categories"
import type { Product, DashboardStats, Sale } from "@/types"
import {
  Wallet,
  Package,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Percent,
  PiggyBank,
  Target,
} from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [statsRes, productsRes, salesRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/products"),
        fetch("/api/sales"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      if (salesRes.ok) {
        const salesData = await salesRes.json()
        setSales(salesData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
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

  const chartDataRaw = sales.reduce((acc, sale) => {
    const saleDate = new Date(sale.saleDate)
    const month = saleDate.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
    const sortKey = saleDate.getFullYear() * 100 + saleDate.getMonth()
    const existing = acc.find((m) => m.month === month)
    if (existing) {
      existing.sales++
      existing.revenue += sale.finalPrice
      existing.profit += sale.netProfit
    } else {
      acc.push({ month, sales: 1, revenue: sale.finalPrice, profit: sale.netProfit, sortKey })
    }
    return acc
  }, [] as { month: string; sales: number; revenue: number; profit: number; sortKey: number }[])
  
  const chartData = chartDataRaw
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((item) => ({ month: item.month, sales: item.sales, revenue: item.revenue, profit: item.profit }))

  // Calculate top products by profit
  const topProductsData = sales.reduce((acc, sale) => {
    const existing = acc.find((p) => p.title === sale.product?.title)
    if (existing) {
      existing.profit += sale.netProfit
      existing.sales++
    } else if (sale.product) {
      acc.push({
        id: sale.product.id,
        title: sale.product.title,
        category: sale.product.category,
        profit: sale.netProfit,
        sales: 1,
        color: getCategoryColor(sale.product.category),
      })
    }
    return acc
  }, [] as { id: string; title: string; category: string; profit: number; sales: number; color: string }[])
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-white">
            Bonjour Alex! 👋
          </h1>
          <p className="text-zinc-500">Voici un aperçu de votre activité</p>
        </div>

        {/* Stats Grid - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Chiffre d'affaires"
            value={formatCurrency(stats?.revenue || 0)}
            icon={BarChart3}
            iconColor="text-violet-400"
            trend={stats?.revenueChange !== undefined ? { value: Math.abs(stats.revenueChange), isPositive: stats.revenueChange >= 0 } : undefined}
          />
          <StatsCard
            title="Articles vendus"
            value={String(stats?.soldCount || 0)}
            icon={ShoppingBag}
            iconColor="text-emerald-400"
            trend={stats?.soldChange !== undefined ? { value: Math.abs(stats.soldChange), isPositive: stats.soldChange >= 0 } : undefined}
          />
          <StatsCard
            title="Articles en stock"
            value={String(stats?.inStockCount || 0)}
            icon={Package}
            iconColor="text-amber-400"
            subtitle={`${formatCurrency(stats?.stockValue || 0)} de valeur`}
          />
          <StatsCard
            title="Bénéfice net"
            value={formatCurrency(stats?.netProfit || 0)}
            icon={TrendingUp}
            iconColor="text-pink-400"
            trend={stats?.profitChange !== undefined ? { value: Math.abs(stats.profitChange), isPositive: stats.profitChange >= 0 } : undefined}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart data={chartData} />
          </div>
          <TopProducts products={topProductsData} />
        </div>

        {/* Stats Grid - Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Marge moyenne"
            value={`${(stats?.averageMargin || 0).toFixed(1)}%`}
            icon={Percent}
            iconColor="text-cyan-400"
          />
          <StatsCard
            title="ROI"
            value={`${(stats?.roi || 0).toFixed(1)}%`}
            icon={Target}
            iconColor="text-orange-400"
          />
          <StatsCard
            title="Investissement"
            value={formatCurrency(stats?.totalInvestment || 0)}
            icon={PiggyBank}
            iconColor="text-indigo-400"
          />
          <StatsCard
            title="Valeur du stock"
            value={formatCurrency(stats?.stockValue || 0)}
            icon={Wallet}
            iconColor="text-rose-400"
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentProducts products={products} />
          </div>
          <CategoryPieChart data={categoryData} />
        </div>
      </div>
    </div>
  )
}
