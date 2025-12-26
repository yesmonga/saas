import fs from "fs"
import path from "path"
import { parsePrice, parseDate } from "./utils"

interface ParsedProduct {
  title: string
  purchasePrice: number
  purchaseDate: Date | null
  sold: boolean
  category: string
  margin: number
  dateHome: Date | null
  platforms: {
    beebs: boolean
    ebay: boolean
    leboncoin: boolean
    vinted: boolean
  }
  notionId: string
}

interface ParsedSale {
  productName: string
  purchasePrice: number
  salePrice: number
  saleDate: Date | null
  profit: number
  platform: string
  roi: string
}

interface ParsedAmazonOrder {
  email: string
  productName: string
  price: number
  purchaseDate: Date | null
  isBanned: boolean
  isPaid: boolean
  isShipped: boolean
  status: string
  orderId: string
}

interface ParsedStock {
  title: string
  purchasePrice: number
  purchaseDate: Date | null
  category: string
  dateHome: Date | null
  sold: boolean
}

export function parseMarkdownFile(filePath: string): ParsedProduct | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const lines = content.split("\n").map((l) => l.trim())

    const titleLine = lines.find((l) => l.startsWith("# "))
    const title = titleLine ? titleLine.replace("# ", "").trim() : ""

    if (!title) return null

    const getValue = (key: string): string => {
      const line = lines.find((l) => l.toLowerCase().startsWith(key.toLowerCase() + ":"))
      return line ? line.split(":").slice(1).join(":").trim() : ""
    }

    const notionId = path.basename(filePath, ".md").split(" ").pop() || ""

    return {
      title,
      purchasePrice: parsePrice(getValue("Paid")),
      purchaseDate: parseDate(getValue("Data acquisto")),
      sold: getValue("Sold").toLowerCase() === "yes",
      category: getValue("Type") || "Autres",
      margin: parseFloat(getValue("Return")) || 0,
      dateHome: parseDate(getValue("Date Home")),
      platforms: {
        beebs: getValue("Beebs").toLowerCase() === "yes",
        ebay: getValue("Ebay").toLowerCase() === "yes",
        leboncoin: getValue("Leboncoin").toLowerCase() === "yes",
        vinted: getValue("Vinted").toLowerCase() === "yes",
      },
      notionId,
    }
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error)
    return null
  }
}

export function parseCSVFile(filePath: string): Record<string, string>[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const lines = content.split("\n").filter((l) => l.trim())

    if (lines.length < 2) return []

    const headers = parseCSVLine(lines[0])
    const records: Record<string, string>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const record: Record<string, string> = {}

      headers.forEach((header, index) => {
        record[header] = values[index] || ""
      })

      records.push(record)
    }

    return records
  } catch (error) {
    console.error(`Error parsing CSV ${filePath}:`, error)
    return []
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

export function parseAmazonCSV(records: Record<string, string>[]): ParsedAmazonOrder[] {
  return records
    .filter((r) => r.Email && r.Email.trim())
    .map((r) => ({
      email: r.Email || "",
      productName: r.Produit || "",
      price: parsePrice(r.Prix),
      purchaseDate: parseDate(r["📅 Date d'achat"] || r["Date d'achat"]),
      isBanned: (r["Banni ?"] || "").toLowerCase() === "yes",
      isPaid: (r["🧾 Commande payée"] || r["Commande payée"] || "").toLowerCase() === "yes",
      isShipped: (r["📦 Commande expédiée / validée"] || r["Commande expédiée"] || "").toLowerCase() === "yes",
      status: r["🎯 Statut / Problème"] || r["Statut"] || "",
      orderId: r["Order Carte cadeau"] || r.Order || "",
    }))
}

export function parseSellingCSV(records: Record<string, string>[]): ParsedSale[] {
  return records
    .filter((r) => r["Item Sold"] || r.Name)
    .map((r) => {
      const itemSold = r["Item Sold"] || ""
      const productName = itemSold.includes("(")
        ? itemSold.split("(")[0].replace(/%20/g, " ").trim()
        : itemSold

      return {
        productName: productName || r.Name || "",
        purchasePrice: parsePrice(r.Paid),
        salePrice: parsePrice(r.Sale),
        saleDate: parseDate(r["Data di Vendita"]),
        profit: parsePrice(r.Profit),
        platform: r.Site || "",
        roi: r.ROI || "",
      }
    })
}

export function parseStockCSV(records: Record<string, string>[]): ParsedStock[] {
  return records
    .filter((r) => r.Item && r.Item.trim())
    .map((r) => ({
      title: r.Item.startsWith("http") ? r.Item.split("/").pop() || r.Item : r.Item,
      purchasePrice: parsePrice(r.Paid),
      purchaseDate: parseDate(r["Data acquisto"]),
      category: r.Type || "Autres",
      dateHome: parseDate(r["Date Home"]),
      sold: (r.Sold || "").toLowerCase() === "yes",
    }))
}

export async function scanNotionFolder(notionPath: string): Promise<{
  products: ParsedProduct[]
  amazonOrders: ParsedAmazonOrder[]
  sales: ParsedSale[]
  stock: ParsedStock[]
}> {
  const products: ParsedProduct[] = []
  const amazonOrders: ParsedAmazonOrder[] = []
  const sales: ParsedSale[] = []
  const stock: ParsedStock[] = []

  if (!fs.existsSync(notionPath)) {
    console.log("Notion folder not found:", notionPath)
    return { products, amazonOrders, sales, stock }
  }

  const files = fs.readdirSync(notionPath)

  for (const file of files) {
    const filePath = path.join(notionPath, file)

    if (file.endsWith(".md")) {
      if (
        file.toLowerCase().includes("database") ||
        file.toLowerCase().includes("selling") ||
        file.toLowerCase().includes("stock") ||
        file.toLowerCase().includes("commandes amazon")
      ) {
        continue
      }

      const parsed = parseMarkdownFile(filePath)
      if (parsed && parsed.title && parsed.purchasePrice > 0) {
        products.push(parsed)
      }
    } else if (file.endsWith(".csv")) {
      const records = parseCSVFile(filePath)

      if (file.toLowerCase().includes("amazon")) {
        amazonOrders.push(...parseAmazonCSV(records))
      } else if (file.toLowerCase().includes("selling")) {
        sales.push(...parseSellingCSV(records))
      } else if (file.toLowerCase().includes("stock")) {
        stock.push(...parseStockCSV(records))
      }
    }
  }

  return { products, amazonOrders, sales, stock }
}

export function getNotionPath(): string {
  const possiblePaths = [
    path.join(process.cwd(), "..", "Notion"),
    path.join(process.cwd(), "Notion"),
    "/Users/alex/CascadeProjects/SAAS ACHAT REVENTE/Notion",
  ]

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p
    }
  }

  return possiblePaths[0]
}
