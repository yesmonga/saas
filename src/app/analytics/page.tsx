"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { getCategoryColor } from "@/data/categories"
import type { Product, Sale } from "@/types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, salesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/sales"),
        ])
        if (prodRes.ok) setProducts(await prodRes.json())
        if (salesRes.ok) setSales(await salesRes.json())
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const categoryData = products.reduce((acc, p) => {
    const existing = acc.find((c) => c.name === p.category)
    if (existing) {
      existing.count++
      existing.value += p.totalCost
    } else {
      acc.push({ name: p.category, count: 1, value: p.totalCost, color: getCategoryColor(p.category) })
    }
    return acc
  }, [] as { name: string; count: number; value: number; color: string }[])

  const monthlyData = sales.reduce((acc, s) => {
    const month = new Date(s.saleDate).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
    const existing = acc.find((m) => m.month === month)
    if (existing) {
      existing.revenue += s.finalPrice
      existing.profit += s.netProfit
      existing.count++
    } else {
      acc.push({ month, revenue: s.finalPrice, profit: s.netProfit, count: 1 })
    }
    return acc
  }, [] as { month: string; revenue: number; profit: number; count: number }[])

  const topProducts = [...sales]
    .sort((a, b) => b.netProfit - a.netProfit)
    .slice(0, 10)

  const oldestUnsold = products
    .filter((p) => p.status !== "sold" && p.dateHome)
    .sort((a, b) => new Date(a.dateHome!).getTime() - new Date(b.dateHome!).getTime())
    .slice(0, 10)

  const avgDaysInStock = products.reduce((sum, p) => {
    if (p.status === "sold" && p.dateHome) {
      const days = Math.ceil((Date.now() - new Date(p.dateHome).getTime()) / (1000 * 60 * 60 * 24))
      return sum + days
    }
    return sum
  }, 0) / (products.filter((p) => p.status === "sold").length || 1)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Analytics" showAddButton={false} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-zinc-400">Temps moyen en stock</p>
              <p className="text-3xl font-bold text-white">{avgDaysInStock.toFixed(0)} jours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-zinc-400">Marge moyenne</p>
              <p className="text-3xl font-bold text-white">
                {sales.length > 0
                  ? (sales.reduce((sum, s) => sum + s.netProfit, 0) / sales.length).toFixed(2)
                  : "0"} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-zinc-400">Taux de vente</p>
              <p className="text-3xl font-bold text-white">
                {products.length > 0
                  ? ((products.filter((p) => p.status === "sold").length / products.length) * 100).toFixed(1)
                  : "0"}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Performance par mois</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                    <XAxis dataKey="month" stroke="#71717A" fontSize={12} />
                    <YAxis stroke="#71717A" fontSize={12} tickFormatter={(v) => `€${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181B", border: "1px solid #27272A", borderRadius: "8px" }} />
                    <Bar dataKey="revenue" fill="#8B5CF6" name="CA" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Répartition par catégorie</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="count">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#18181B", border: "1px solid #27272A", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.slice(0, 6).map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-zinc-400 truncate">{cat.name}</span>
                    <span className="font-medium ml-auto">{cat.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Top 10 ventes les plus rentables</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((sale, i) => (
                  <div key={sale.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30">
                    <span className="text-lg font-bold text-zinc-500 w-6">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{sale.product?.title || "Produit"}</p>
                      <p className="text-sm text-zinc-400">{formatDate(sale.saleDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-500 font-bold">+{formatCurrency(sale.netProfit)}</p>
                      <p className="text-xs text-zinc-400">{formatCurrency(sale.finalPrice)}</p>
                    </div>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <p className="text-center py-4 text-zinc-500">Aucune vente</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Articles les plus anciens en stock</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {oldestUnsold.map((product) => {
                  const days = product.dateHome
                    ? Math.ceil((Date.now() - new Date(product.dateHome).getTime()) / (1000 * 60 * 60 * 24))
                    : 0
                  return (
                    <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.title}</p>
                        <p className="text-sm text-zinc-400">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={days > 60 ? "text-red-500" : days > 30 ? "text-yellow-500" : "text-zinc-400"}>
                          {days} jours
                        </p>
                        <p className="text-xs text-zinc-400">{formatCurrency(product.sellingPrice)}</p>
                      </div>
                    </div>
                  )
                })}
                {oldestUnsold.length === 0 && (
                  <p className="text-center py-4 text-zinc-500">Aucun article en stock</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
