"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { AmazonOrder } from "@/types"
import {
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  Search,
} from "lucide-react"

export default function AmazonPage() {
  const [orders, setOrders] = useState<AmazonOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "banned" | "pending" | "shipped">("all")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/amazon")
        if (res.ok) setOrders(await res.json())
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    if (search && !order.email.toLowerCase().includes(search.toLowerCase()) &&
        !order.productName.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (filter === "banned" && !order.isBanned) return false
    if (filter === "pending" && order.isShipped) return false
    if (filter === "shipped" && !order.isShipped) return false
    return true
  })

  const totalOrders = orders.length
  const bannedCount = orders.filter((o) => o.isBanned).length
  const shippedCount = orders.filter((o) => o.isShipped).length
  const pendingCount = orders.filter((o) => !o.isShipped && !o.isBanned).length
  const totalSpent = orders.reduce((sum, o) => sum + o.price, 0)

  const getStatusBadge = (order: AmazonOrder) => {
    if (order.isBanned) {
      return <Badge className="bg-red-500/20 text-red-500">🚫 Banni</Badge>
    }
    if (order.isShipped) {
      return <Badge className="bg-green-500/20 text-green-500">✅ Expédié</Badge>
    }
    if (order.isPaid) {
      return <Badge className="bg-yellow-500/20 text-yellow-500">⏳ En attente</Badge>
    }
    return <Badge className="bg-zinc-500/20 text-zinc-400">📝 Non payé</Badge>
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Commandes Amazon" showAddButton={false} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total commandes"
            value={String(totalOrders)}
            icon={Package}
            subtitle={formatCurrency(totalSpent)}
          />
          <StatsCard
            title="Expédiées"
            value={String(shippedCount)}
            icon={CheckCircle}
          />
          <StatsCard
            title="En attente"
            value={String(pendingCount)}
            icon={Truck}
          />
          <StatsCard
            title="Comptes bannis"
            value={String(bannedCount)}
            icon={XCircle}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Rechercher par email ou produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Tous
            </Button>
            <Button
              variant={filter === "shipped" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("shipped")}
            >
              Expédiés
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              En attente
            </Button>
            <Button
              variant={filter === "banned" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("banned")}
              className={filter === "banned" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Bannis
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Commandes ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">Email</th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">Produit</th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">Prix</th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">Date</th>
                    <th className="text-center p-4 text-sm font-medium text-zinc-400">Payée</th>
                    <th className="text-center p-4 text-sm font-medium text-zinc-400">Expédiée</th>
                    <th className="text-center p-4 text-sm font-medium text-zinc-400">Statut</th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-400">N° Commande</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 ${
                        order.isBanned ? "bg-red-500/5" : ""
                      }`}
                    >
                      <td className="p-4">
                        <span className={`text-sm ${order.isBanned ? "text-red-400" : ""}`}>
                          {order.email}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{order.productName}</td>
                      <td className="p-4 text-right">{formatCurrency(order.price)}</td>
                      <td className="p-4 text-zinc-400">{formatDate(order.purchaseDate)}</td>
                      <td className="p-4 text-center">
                        {order.isPaid ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-zinc-600 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {order.isShipped ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-zinc-600 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">{getStatusBadge(order)}</td>
                      <td className="p-4 text-sm text-zinc-400 font-mono">
                        {order.orderId || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <p className="text-center py-8 text-zinc-500">
                  {search || filter !== "all"
                    ? "Aucune commande trouvée avec ces filtres"
                    : "Aucune commande Amazon. Importez vos données depuis Notion."}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {bannedCount > 0 && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                Comptes à risque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {orders
                  .filter((o) => o.isBanned)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30"
                    >
                      <div>
                        <p className="font-medium text-red-400">{order.email}</p>
                        <p className="text-sm text-zinc-400">{order.productName}</p>
                      </div>
                      <Badge className="bg-red-500/20 text-red-500">{order.status || "Banni"}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
