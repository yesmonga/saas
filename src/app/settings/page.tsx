"use client"

import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Link as LinkIcon,
  Palette,
  Download,
  Save,
  Github,
  ExternalLink,
} from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    name: "Alex",
    email: "",
  })

  const [connections, setConnections] = useState({
    vinted: "https://www.vinted.fr/member/14582133",
    ebay: "",
    github: "https://github.com/yesmonga/saas",
  })

  const [fees, setFees] = useState({
    vinted: 5,
    ebay: 10,
    leboncoin: 0,
    beebs: 8,
  })

  const [theme, setTheme] = useState("dark")

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    toast({ title: "Paramètres sauvegardés", variant: "success" })
    setSaving(false)
  }

  const handleExport = async () => {
    try {
      const [productsRes, salesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/sales"),
      ])

      const data = {
        products: await productsRes.json(),
        sales: await salesRes.json(),
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `resellhub-export-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast({ title: "Export réussi !", variant: "success" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erreur d'export", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Paramètres" showAddButton={false} />
      <div className="p-6 space-y-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>Informations de votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Connexions
            </CardTitle>
            <CardDescription>Liens vers vos profils de vente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Profil Vinted</Label>
              <div className="flex gap-2">
                <Input
                  value={connections.vinted}
                  onChange={(e) => setConnections({ ...connections, vinted: e.target.value })}
                  placeholder="https://www.vinted.fr/member/..."
                />
                {connections.vinted && (
                  <a href={connections.vinted} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Profil eBay</Label>
              <Input
                value={connections.ebay}
                onChange={(e) => setConnections({ ...connections, ebay: e.target.value })}
                placeholder="https://www.ebay.fr/usr/..."
              />
            </div>
            <div className="space-y-2">
              <Label>GitHub Repository</Label>
              <div className="flex gap-2">
                <Input
                  value={connections.github}
                  onChange={(e) => setConnections({ ...connections, github: e.target.value })}
                  placeholder="https://github.com/..."
                />
                {connections.github && (
                  <a href={connections.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <Github className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>Personnalisez l&apos;interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Mode sombre</Label>
                <p className="text-sm text-zinc-400">Activé par défaut</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(c) => setTheme(c ? "dark" : "light")} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Langue</Label>
                <p className="text-sm text-zinc-400">Français</p>
              </div>
              <span className="text-sm text-zinc-500">🇫🇷 FR</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Devise</Label>
                <p className="text-sm text-zinc-400">Euro</p>
              </div>
              <span className="text-sm text-zinc-500">€ EUR</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frais par défaut</CardTitle>
            <CardDescription>Pourcentage de frais par plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Vinted (%)</Label>
                <Input
                  type="number"
                  value={fees.vinted}
                  onChange={(e) => setFees({ ...fees, vinted: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>eBay (%)</Label>
                <Input
                  type="number"
                  value={fees.ebay}
                  onChange={(e) => setFees({ ...fees, ebay: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Leboncoin (%)</Label>
                <Input
                  type="number"
                  value={fees.leboncoin}
                  onChange={(e) => setFees({ ...fees, leboncoin: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Beebs (%)</Label>
                <Input
                  type="number"
                  value={fees.beebs}
                  onChange={(e) => setFees({ ...fees, beebs: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export</CardTitle>
            <CardDescription>Exportez vos données</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter en JSON
            </Button>
            <p className="text-sm text-zinc-500">
              Exportez tous vos produits et ventes en fichier JSON.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
          </Button>
        </div>
      </div>
    </div>
  )
}
