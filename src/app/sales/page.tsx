"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Sale, Product } from "@/types"
import { DollarSign, TrendingUp, ShoppingCart, Plus } from "lucide-react"

const platforms = ["Vinted", "eBay", "Leboncoin", "Beebs", "Vestiaire Collective", "Mains propres", "Autre"]

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    productId: "",
    finalPrice: 0,
    platformFees: 0,
    shippingCost: 0,
    platform: "Vinted",
    saleDate: new Date().toISOString().split("T")[0],
    buyerName: "",
  })

  const fetchData = async () => {
    try {
      const [salesRes, productsRes] = await Promise.all([
        fetch("/api/sales"),
        fetch("/api/products?status=listed"),
      ])
      if (salesRes.ok) setSales(await salesRes.json())
      if (productsRes.ok) {
        const allProducts = await productsRes.json()
        setProducts(allProducts.filter((p: Product) => p.status !== "sold"))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const selectedProduct = products.find((p) => p.id === formData.productId)
  const netProfit = selectedProduct
    ? formData.finalPrice - selectedProduct.totalCost - formData.platformFees - formData.shippingCost
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.productId) {
      toast({ title: "Sélectionnez un produit", variant: "destructive" })
      return
    }

    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast({ title: "Vente enregistrée !", variant: "success" })
        setDialogOpen(false)
        setFormData({
          productId: "",
          finalPrice: 0,
          platformFees: 0,
          shippingCost: 0,
          platform: "Vinted",
          saleDate: new Date().toISOString().split("T")[0],
          buyerName: "",
        })
        fetchData()
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur", variant: "destructive" })
    }
  }

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
      <Header title="Ventes" showAddButton={false} />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Historique des ventes</h2>
            <p className="text-zinc-400">{sales.length} vente{sales.length > 1 ? "s" : ""} enregistrée{sales.length > 1 ? "s" : ""}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Enregistrer une vente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nouvelle vente</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Produit *</Label>
                  <Select value={formData.productId} onValueChange={(v) => setFormData({ ...formData, productId: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner un produit" /></SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title} - {formatCurrency(p.sellingPrice)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prix final (€)</Label>
                    <Input type="number" step="0.01" value={formData.finalPrice || ""} onChange={(e) => setFormData({ ...formData, finalPrice: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de vente</Label>
                    <Input type="date" value={formData.saleDate} onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Frais plateforme (€)</Label>
                    <Input type="number" step="0.01" value={formData.platformFees || ""} onChange={(e) => setFormData({ ...formData, platformFees: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Frais envoi (€)</Label>
                    <Input type="number" step="0.01" value={formData.shippingCost || ""} onChange={(e) => setFormData({ ...formData, shippingCost: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Plateforme</Label>
                  <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProduct && (
                  <div className="rounded-xl bg-zinc-800/50 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Coût total:</span>
                      <span>{formatCurrency(selectedProduct.totalCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Prix de vente:</span>
                      <span>{formatCurrency(formData.finalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Frais:</span>
                      <span>-{formatCurrency(formData.platformFees + formData.shippingCost)}</span>
                    </div>
                    <div className="border-t border-zinc-700 pt-2 flex justify-between font-bold">
                      <span>Bénéfice net:</span>
                      <span className={netProfit >= 0 ? "text-green-500" : "text-red-500"}>
                        {formatCurrency(netProfit)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
