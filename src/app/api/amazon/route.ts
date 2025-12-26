import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const orders = await prisma.amazonOrder.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching Amazon orders:", error)
    return NextResponse.json({ error: "Failed to fetch Amazon orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const order = await prisma.amazonOrder.create({
      data: {
        email: body.email,
        productName: body.productName,
        price: body.price || 0,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        isBanned: body.isBanned || false,
        isPaid: body.isPaid || false,
        isShipped: body.isShipped || false,
        status: body.status || null,
        orderId: body.orderId || null,
        productId: body.productId || null,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating Amazon order:", error)
    return NextResponse.json({ error: "Failed to create Amazon order" }, { status: 500 })
  }
}
