import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

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

    // This month sales
    const thisMonthSales = sales.filter(
      (s) => new Date(s.saleDate) >= startOfMonth
    )
    const revenueThisMonth = thisMonthSales.reduce((sum, s) => sum + s.finalPrice, 0)
    const profitThisMonth = thisMonthSales.reduce((sum, s) => sum + s.netProfit, 0)
    const soldThisMonth = thisMonthSales.length

    // Last month sales
    const lastMonthSales = sales.filter(
      (s) => {
        const saleDate = new Date(s.saleDate)
        return saleDate >= startOfLastMonth && saleDate <= endOfLastMonth
      }
    )
    const revenueLastMonth = lastMonthSales.reduce((sum, s) => sum + s.finalPrice, 0)
    const profitLastMonth = lastMonthSales.reduce((sum, s) => sum + s.netProfit, 0)
    const soldLastMonth = lastMonthSales.length

    // Calculate percentage changes (comparing this month to last month)
    const revenueChange = revenueLastMonth > 0 
      ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) 
      : revenueThisMonth > 0 ? 100 : 0

    const profitChange = profitLastMonth > 0 
      ? Math.round(((profitThisMonth - profitLastMonth) / profitLastMonth) * 100) 
      : profitThisMonth > 0 ? 100 : 0

    const soldChange = soldLastMonth > 0 
      ? Math.round(((soldThisMonth - soldLastMonth) / soldLastMonth) * 100) 
      : soldThisMonth > 0 ? 100 : 0

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
      soldThisMonth,
      soldLastMonth,
      revenue: totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      netProfit: totalProfit,
      profitThisMonth,
      profitLastMonth,
      // Percentage changes vs last month
      revenueChange,
      profitChange,
      soldChange,
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
