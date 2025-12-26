import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const products = await prisma.product.findMany({
      include: { sales: true },
    })

    const sales = await prisma.sale.findMany({
      include: { product: true },
    })

    const inStockProducts = products.filter((p) => p.status !== "sold")
    const soldProducts = products.filter((p) => p.status === "sold")

    const stockValue = inStockProducts.reduce((sum, p) => sum + p.sellingPrice, 0)

    const totalRevenue = sales.reduce((sum, s) => sum + s.finalPrice, 0)
    const totalProfit = sales.reduce((sum, s) => sum + s.netProfit, 0)

    const monthSales = sales.filter(
      (s) => new Date(s.saleDate) >= startOfMonth
    )
    const revenueThisMonth = monthSales.reduce((sum, s) => sum + s.finalPrice, 0)
    const profitThisMonth = monthSales.reduce((sum, s) => sum + s.netProfit, 0)

    const totalInvestment = products.reduce((sum, p) => sum + p.totalCost, 0)

    const avgMargin =
      sales.length > 0
        ? sales.reduce((sum, s) => {
            const product = s.product
            if (product && product.totalCost > 0) {
              return sum + ((s.netProfit / product.totalCost) * 100)
            }
            return sum
          }, 0) / sales.length
        : 0

    const roi = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0

    const totalViews = products.reduce((sum, p) => sum + (p.vintedViews || 0), 0)
    const totalFavorites = products.reduce((sum, p) => sum + (p.vintedFavorites || 0), 0)

    const stats = {
      stockValue,
      inStockCount: inStockProducts.length,
      soldCount: soldProducts.length,
      soldThisMonth: monthSales.length,
      revenue: totalRevenue,
      revenueThisMonth,
      netProfit: totalProfit,
      profitThisMonth,
      averageMargin: avgMargin,
      totalInvestment,
      roi,
      totalViews,
      totalFavorites,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
