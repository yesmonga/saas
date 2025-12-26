import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { sales: true },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...product,
      photos: JSON.parse(product.photos || "[]"),
      tags: JSON.parse(product.tags || "[]"),
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const totalCost = (body.purchasePrice || 0) + (body.additionalFees || 0)
    const margin = (body.sellingPrice || 0) - totalCost
    const marginPercent = totalCost > 0 ? (margin / totalCost) * 100 : 0

    const product = await prisma.product.update({
      where: { id: params.id },
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
      },
    })

    return NextResponse.json({
      ...product,
      photos: JSON.parse(product.photos),
      tags: JSON.parse(product.tags),
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
