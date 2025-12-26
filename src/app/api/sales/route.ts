import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { saleDate: "desc" },
      include: { product: true },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error("Error fetching sales:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const product = await prisma.product.findUnique({
      where: { id: body.productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const netProfit =
      body.finalPrice - product.totalCost - (body.platformFees || 0) - (body.shippingCost || 0)

    const sale = await prisma.sale.create({
      data: {
        productId: body.productId,
        saleDate: new Date(body.saleDate),
        finalPrice: body.finalPrice,
        platformFees: body.platformFees || 0,
        shippingCost: body.shippingCost || 0,
        netProfit,
        platform: body.platform,
        buyerName: body.buyerName || null,
        notes: body.notes || null,
      },
      include: { product: true },
    })

    await prisma.product.update({
      where: { id: body.productId },
      data: {
        status: "sold",
        margin: netProfit,
        marginPercent: product.totalCost > 0 ? (netProfit / product.totalCost) * 100 : 0,
      },
    })

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Error creating sale:", error)
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}
