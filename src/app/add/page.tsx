"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

const categories = [
  "Pokemon",
  "Pop Mart",
  "Sneakers",
  "Figurines & Collectibles",
  "Vêtements",
  "Vinyles & Musique",
  "Jouets & Poupées",
  "Trading Cards",
  "Accessoires",
  "Mattel",
  "Lorcana",
  "Autres",
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
]

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()
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
    ebayUrl: "",
    leboncoinUrl: "",
    beebsUrl: "",
    amazonEmail: "",
    amazonOrderId: "",
  })

  const [platforms, setPlatforms] = useState({
    vinted: false,
    ebay: false,
    leboncoin: false,
    beebs: false,
  })

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

    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          purchaseDate: formData.purchaseDate || null,
          dateHome: formData.dateHome || null,
        }),
      })

      if (res.ok) {
        toast({
          title: "Produit créé !",
          description: "Le produit a été ajouté avec succès",
          variant: "success",
        })
        router.push("/inventory")
      } else {
        const data = await res.json()
        toast({
          title: "Erreur",
          description: data.error || "Impossible de créer le produit",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Ajouter un produit" showAddButton={false} />
      <div className="p-6">
        <div className="mb-6">
          <Link href="/inventory">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;inventaire
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nom du produit"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marque</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Marque du produit"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du produit..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>État</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((cond) => (
                        <SelectItem key={cond.value} value={cond.value}>
                          {cond.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prix & Coûts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Prix d&apos;achat (€) *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.purchasePrice || ""}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalFees">Frais supplémentaires (€)</Label>
                  <Input
                    id="additionalFees"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.additionalFees || ""}
                    onChange={(e) => setFormData({ ...formData, additionalFees: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Prix de vente (€)</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sellingPrice || ""}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-zinc-800/50 p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-zinc-400">Coût total</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(totalCost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Prix de vente</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(formData.sellingPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Marge</p>
                    <p className={`text-lg font-bold ${getMarginIndicator().color}`}>
                      {margin >= 0 ? "+" : ""}{formatCurrency(margin)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">ROI</p>
                    <p className={`text-lg font-bold ${getMarginIndicator().color}`}>
                      {marginPercent >= 0 ? "+" : ""}{marginPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <p className={`text-center mt-2 text-sm ${getMarginIndicator().color}`}>
                  {getMarginIndicator().label}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plateformes de vente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(platforms).map(([platform, checked]) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={checked}
                      onCheckedChange={(checked) =>
                        setPlatforms({ ...platforms, [platform]: checked as boolean })
                      }
                    />
                    <Label htmlFor={platform} className="capitalize">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>

              {platforms.vinted && (
                <div className="space-y-2">
                  <Label htmlFor="vintedUrl">Lien Vinted</Label>
                  <Input
                    id="vintedUrl"
                    value={formData.vintedUrl}
                    onChange={(e) => setFormData({ ...formData, vintedUrl: e.target.value })}
                    placeholder="https://www.vinted.fr/..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Date d&apos;achat</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateHome">Date de réception</Label>
                  <Input
                    id="dateHome"
                    type="date"
                    value={formData.dateHome}
                    onChange={(e) => setFormData({ ...formData, dateHome: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseSource">Source d&apos;achat</Label>
                  <Input
                    id="purchaseSource"
                    value={formData.purchaseSource}
                    onChange={(e) => setFormData({ ...formData, purchaseSource: e.target.value })}
                    placeholder="Amazon, Retail, Vide-grenier..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes personnelles..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suivi Amazon (optionnel)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amazonEmail">Email du compte</Label>
                  <Input
                    id="amazonEmail"
                    type="email"
                    value={formData.amazonEmail}
                    onChange={(e) => setFormData({ ...formData, amazonEmail: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amazonOrderId">Numéro de commande</Label>
                  <Input
                    id="amazonOrderId"
                    value={formData.amazonOrderId}
                    onChange={(e) => setFormData({ ...formData, amazonOrderId: e.target.value })}
                    placeholder="xxx-xxxxxxx-xxxxxxx"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/inventory">
              <Button variant="outline">Annuler</Button>
            </Link>
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
