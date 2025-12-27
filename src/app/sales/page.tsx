"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Sale } from "@/types"
import { DollarSign, TrendingUp, ShoppingCart } from "lucide-react"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const salesRes = await fetch("/api/sales")
      if (salesRes.ok) setSales(await salesRes.json())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthSales = sales.filter((s) => new Date(s.saleDate) >= startOfMonth)
  const totalRevenue = sales.reduce((sum, s) => sum + s.finalPrice, 0)
  const monthRevenue = monthSales.reduce((sum, s) => sum + s.finalPrice, 0)
  const totalProfit = sales.reduce((sum, s) => sum + s.netProfit, 0)
  const monthProfit = monthSales.reduce((sum, s) => sum + s.netProfit, 0)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Historique des ventes</h2>
          <p className="text-sm md:text-base text-zinc-400">{sales.length} vente{sales.length > 1 ? "s" : ""} enregistrée{sales.length > 1 ? "s" : ""}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatsCard title="CA ce mois" value={formatCurrency(monthRevenue)} icon={DollarSign} subtitle={`${monthSales.length} ventes`} />
          <StatsCard title="Bénéfice ce mois" value={formatCurrency(monthProfit)} icon={TrendingUp} />
          <StatsCard title="CA total" value={formatCurrency(totalRevenue)} icon={ShoppingCart} subtitle={`${sales.length} ventes`} />
          <StatsCard title="Bénéfice total" value={formatCurrency(totalProfit)} icon={TrendingUp} />
        </div>

        <Card>
          <CardHeader><CardTitle>Historique</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">Produit</th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">Prix</th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">Frais</th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">Bénéfice</th>
                    <th className="text-center p-4 text-sm font-medium text-zinc-400">Plateforme</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="p-4 font-medium">{sale.product?.title || "Produit inconnu"}</td>
                      <td className="p-4 text-zinc-400">{formatDate(sale.saleDate)}</td>
                      <td className="p-4 text-right">{formatCurrency(sale.finalPrice)}</td>
                      <td className="p-4 text-right text-zinc-400">
                        {formatCurrency(sale.platformFees + sale.shippingCost)}
                      </td>
                      <td className={`p-4 text-right font-medium ${sale.netProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {sale.netProfit >= 0 ? "+" : ""}{formatCurrency(sale.netProfit)}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="secondary">{sale.platform}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sales.length === 0 && (
                <p className="text-center py-8 text-zinc-500">Aucune vente enregistrée</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
