"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Save, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/types"

const categories = [
  "Pokemon", "Pop Mart", "Sneakers", "Figurines & Collectibles",
  "Vêtements", "Vinyles & Musique", "Jouets & Poupées", "Trading Cards",
  "Accessoires", "Mattel", "Lorcana", "Autres",
]

const conditions = [
  { value: "new_with_tags", label: "Neuf avec étiquette" },
  { value: "new_without_tags", label: "Neuf sans étiquette" },
  { value: "very_good", label: "Très bon état" },
  { value: "good", label: "Bon état" },
  { value: "satisfactory", label: "Satisfaisant" },
]

const statuses = [
  { value: "draft", label: "Brouillon" },
  { value: "in_stock", label: "En stock" },
  { value: "listed", label: "En vente" },
  { value: "reserved", label: "Réservé" },
  { value: "sold", label: "Vendu" },
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Autres",
    subcategory: "",
    brand: "",
    condition: "new_with_tags",
    purchasePrice: 0,
    additionalFees: 0,
    sellingPrice: 0,
    status: "in_stock",
    purchaseDate: "",
    purchaseSource: "",
    dateHome: "",
    notes: "",
    vintedUrl: "",
    vintedViews: 0,
    vintedFavorites: 0,
    ebayUrl: "",
    leboncoinUrl: "",
    beebsUrl: "",
    amazonEmail: "",
    amazonOrderId: "",
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (res.ok) {
          const product: Product = await res.json()
          setFormData({
            title: product.title || "",
            description: product.description || "",
            category: product.category || "Autres",
            subcategory: product.subcategory || "",
            brand: product.brand || "",
            condition: product.condition || "new_with_tags",
            purchasePrice: product.purchasePrice || 0,
            additionalFees: product.additionalFees || 0,
            sellingPrice: product.sellingPrice || 0,
            status: product.status || "in_stock",
            purchaseDate: product.purchaseDate ? new Date(product.purchaseDate).toISOString().split("T")[0] : "",
            purchaseSource: product.purchaseSource || "",
            dateHome: product.dateHome ? new Date(product.dateHome).toISOString().split("T")[0] : "",
            notes: product.notes || "",
            vintedUrl: product.vintedUrl || "",
            vintedViews: product.vintedViews || 0,
            vintedFavorites: product.vintedFavorites || 0,
            ebayUrl: product.ebayUrl || "",
            leboncoinUrl: product.leboncoinUrl || "",
            beebsUrl: product.beebsUrl || "",
            amazonEmail: product.amazonEmail || "",
            amazonOrderId: product.amazonOrderId || "",
          })
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchProduct()
  }, [params.id])

  const totalCost = formData.purchasePrice + formData.additionalFees
  const margin = formData.sellingPrice - totalCost
  const marginPercent = totalCost > 0 ? (margin / totalCost) * 100 : 0

  const getMarginIndicator = () => {
    if (marginPercent >= 30) return { color: "text-green-500", label: "🟢 Excellente marge" }
    if (marginPercent >= 15) return { color: "text-yellow-500", label: "🟡 Marge correcte" }
    return { color: "text-red-500", label: "🔴 Marge faible" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          purchaseDate: formData.purchaseDate || null,
          dateHome: formData.dateHome || null,
        }),
      })

      if (res.ok) {
        toast({ title: "Produit mis à jour !", variant: "success" })
        router.push("/inventory")
      } else {
        toast({ title: "Erreur", description: "Impossible de mettre à jour", variant: "destructive" })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Supprimer ce produit ?")) return

    try {
      const res = await fetch(`/api/products/${params.id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Produit supprimé", variant: "success" })
        router.push("/inventory")
      }
    } catch (error) {
      console.error(error)
    }
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
      <Header title="Modifier le produit" showAddButton={false} />
      <div className="p-6">
        <div className="mb-6 flex justify-between">
          <Link href="/inventory">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Marque</Label>
                  <Input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>État</Label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Prix & Coûts</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Prix d&apos;achat (€)</Label>
                  <Input type="number" step="0.01" value={formData.purchasePrice || ""} onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Frais supp. (€)</Label>
                  <Input type="number" step="0.01" value={formData.additionalFees || ""} onChange={(e) => setFormData({ ...formData, additionalFees: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Prix de vente (€)</Label>
                  <Input type="number" step="0.01" value={formData.sellingPrice || ""} onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="rounded-xl bg-zinc-800/50 p-4">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div><p className="text-sm text-zinc-400">Coût</p><p className="font-bold">{formatCurrency(totalCost)}</p></div>
                  <div><p className="text-sm text-zinc-400">Vente</p><p className="font-bold">{formatCurrency(formData.sellingPrice)}</p></div>
                  <div><p className="text-sm text-zinc-400">Marge</p><p className={`font-bold ${getMarginIndicator().color}`}>{formatCurrency(margin)}</p></div>
                  <div><p className="text-sm text-zinc-400">ROI</p><p className={`font-bold ${getMarginIndicator().color}`}>{marginPercent.toFixed(1)}%</p></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Stats Vinted</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Lien Vinted</Label>
                  <Input value={formData.vintedUrl} onChange={(e) => setFormData({ ...formData, vintedUrl: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Vues</Label>
                  <Input type="number" value={formData.vintedViews} onChange={(e) => setFormData({ ...formData, vintedViews: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Favoris</Label>
                  <Input type="number" value={formData.vintedFavorites} onChange={(e) => setFormData({ ...formData, vintedFavorites: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Dates</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date d&apos;achat</Label>
                  <Input type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Date réception</Label>
                  <Input type="date" value={formData.dateHome} onChange={(e) => setFormData({ ...formData, dateHome: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Input value={formData.purchaseSource} onChange={(e) => setFormData({ ...formData, purchaseSource: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/inventory"><Button variant="outline">Annuler</Button></Link>
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
