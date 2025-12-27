import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const original = await prisma.product.findUnique({
      where: { id },
    })

    if (!original) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Create duplicate without id, createdAt, updatedAt
    const duplicate = await prisma.product.create({
      data: {
        title: original.title,
        description: original.description,
        purchasePrice: original.purchasePrice,
        sellingPrice: original.sellingPrice,
        totalCost: original.totalCost,
        category: original.category,
        subcategory: original.subcategory,
        condition: original.condition,
        status: "in_stock",
        photos: original.photos,
        purchaseDate: original.purchaseDate,
        dateHome: original.dateHome,
        amazonEmail: original.amazonEmail,
        amazonOrderId: original.amazonOrderId,
        pokemonSeries: original.pokemonSeries,
      },
    })

    return NextResponse.json(duplicate)
  } catch (error) {
    console.error("Error duplicating product:", error)
    return NextResponse.json({ error: "Failed to duplicate product" }, { status: 500 })
  }
}
