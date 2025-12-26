import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const where: Record<string, unknown> = {}

    if (status && status !== "all") {
      where.status = status
    }

    if (category && category !== "all") {
      where.category = category
    }

    if (search) {
      where.title = {
        contains: search,
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        sales: true,
      },
    })

    const formattedProducts = products.map((p) => ({
      ...p,
      photos: JSON.parse(p.photos || "[]"),
      tags: JSON.parse(p.tags || "[]"),
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const totalCost = (body.purchasePrice || 0) + (body.additionalFees || 0)
    const margin = (body.sellingPrice || 0) - totalCost
    const marginPercent = totalCost > 0 ? (margin / totalCost) * 100 : 0

    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description || null,
        photos: JSON.stringify(body.photos || []),
        category: body.category || "Autres",
        subcategory: body.subcategory || null,
        brand: body.brand || null,
        condition: body.condition || "new_with_tags",
        purchasePrice: body.purchasePrice || 0,
        additionalFees: body.additionalFees || 0,
        totalCost,
        sellingPrice: body.sellingPrice || 0,
        margin,
        marginPercent,
        status: body.status || "in_stock",
        vintedUrl: body.vintedUrl || null,
        vintedViews: body.vintedViews || 0,
        vintedFavorites: body.vintedFavorites || 0,
        vintedListedAt: body.vintedListedAt ? new Date(body.vintedListedAt) : null,
        ebayUrl: body.ebayUrl || null,
        leboncoinUrl: body.leboncoinUrl || null,
        beebsUrl: body.beebsUrl || null,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        purchaseSource: body.purchaseSource || null,
        dateHome: body.dateHome ? new Date(body.dateHome) : null,
        notes: body.notes || null,
        tags: JSON.stringify(body.tags || []),
        amazonEmail: body.amazonEmail || null,
        amazonOrderId: body.amazonOrderId || null,
        amazonStatus: body.amazonStatus || null,
        notionId: body.notionId || null,
      },
    })

    return NextResponse.json({
      ...product,
      photos: JSON.parse(product.photos),
      tags: JSON.parse(product.tags),
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
