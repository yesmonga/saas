import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const series = await prisma.pokemonSeries.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(series)
  } catch (error) {
    console.error("Error fetching Pokemon series:", error)
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, color } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Get the max order to add new series at the end
    const maxOrder = await prisma.pokemonSeries.aggregate({
      _max: { order: true },
    })

    const series = await prisma.pokemonSeries.create({
      data: {
        name,
        code: code || null,
        color: color || "#FFCB05",
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(series, { status: 201 })
  } catch (error) {
    console.error("Error creating Pokemon series:", error)
    return NextResponse.json({ error: "Failed to create series" }, { status: 500 })
  }
}
