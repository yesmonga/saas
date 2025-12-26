import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { scanNotionFolder, getNotionPath } from "@/lib/import-notion"
import { defaultCategories } from "@/data/categories"

export async function POST() {
  try {
    const notionPath = getNotionPath()
    console.log("Scanning Notion folder:", notionPath)

    const { products, amazonOrders, sales, stock } = await scanNotionFolder(notionPath)

    const results = {
      productsImported: 0,
      productsSkipped: 0,
      amazonOrdersImported: 0,
      salesImported: 0,
      categoriesCreated: 0,
      errors: [] as string[],
    }

    for (const cat of defaultCategories) {
      try {
        await prisma.category.upsert({
          where: { name: cat.name },
          update: { color: cat.color, icon: cat.icon },
          create: { name: cat.name, color: cat.color, icon: cat.icon },
        })
        results.categoriesCreated++
      } catch {
        // Category might already exist
      }
    }

    const productMap = new Map<string, string>()

    for (const item of stock) {
      try {
        const existingProduct = await prisma.product.findFirst({
          where: {
            title: item.title,
            purchasePrice: item.purchasePrice,
          },
        })

        if (existingProduct) {
          results.productsSkipped++
          productMap.set(item.title.toLowerCase(), existingProduct.id)
          continue
        }

        const product = await prisma.product.create({
          data: {
            title: item.title,
            category: item.category || "Autres",
            purchasePrice: item.purchasePrice,
            totalCost: item.purchasePrice,
            sellingPrice: item.purchasePrice * 1.3,
            status: item.sold ? "sold" : "in_stock",
            purchaseDate: item.purchaseDate,
            dateHome: item.dateHome,
          },
        })

        productMap.set(item.title.toLowerCase(), product.id)
        results.productsImported++
      } catch (error) {
        results.errors.push(`Stock item error: ${item.title}`)
        console.error("Error importing stock item:", error)
      }
    }

    for (const product of products) {
      try {
        const existing = await prisma.product.findUnique({
          where: { notionId: product.notionId },
        })

        if (existing) {
          results.productsSkipped++
          productMap.set(product.title.toLowerCase(), existing.id)
          continue
        }

        const existingByTitle = await prisma.product.findFirst({
          where: {
            title: product.title,
            purchasePrice: product.purchasePrice,
          },
        })

        if (existingByTitle) {
          results.productsSkipped++
          productMap.set(product.title.toLowerCase(), existingByTitle.id)
          continue
        }

        const hasPlatform = product.platforms.vinted || product.platforms.ebay || 
                           product.platforms.leboncoin || product.platforms.beebs
        const status = product.sold ? "sold" : hasPlatform ? "listed" : "in_stock"

        const created = await prisma.product.create({
          data: {
            title: product.title,
            category: product.category || "Autres",
            purchasePrice: product.purchasePrice,
            totalCost: product.purchasePrice,
            sellingPrice: product.purchasePrice + Math.abs(product.margin),
            margin: product.margin,
            marginPercent: product.purchasePrice > 0 
              ? (product.margin / product.purchasePrice) * 100 
              : 0,
            status,
            purchaseDate: product.purchaseDate,
            dateHome: product.dateHome,
            notionId: product.notionId,
            vintedUrl: product.platforms.vinted ? "listed" : null,
            ebayUrl: product.platforms.ebay ? "listed" : null,
            leboncoinUrl: product.platforms.leboncoin ? "listed" : null,
            beebsUrl: product.platforms.beebs ? "listed" : null,
          },
        })

        productMap.set(product.title.toLowerCase(), created.id)
        results.productsImported++
      } catch (error) {
        results.errors.push(`Product error: ${product.title}`)
        console.error("Error importing product:", error)
      }
    }

    for (const order of amazonOrders) {
      try {
        if (!order.email) continue

        const existing = await prisma.amazonOrder.findFirst({
          where: {
            email: order.email,
            productName: order.productName,
            price: order.price,
          },
        })

        if (existing) continue

        await prisma.amazonOrder.create({
          data: {
            email: order.email,
            productName: order.productName,
            price: order.price,
            purchaseDate: order.purchaseDate,
            isBanned: order.isBanned,
            isPaid: order.isPaid,
            isShipped: order.isShipped,
            status: order.status,
            orderId: order.orderId,
          },
        })

        results.amazonOrdersImported++
      } catch (error) {
        results.errors.push(`Amazon order error: ${order.email}`)
        console.error("Error importing Amazon order:", error)
      }
    }

    for (const sale of sales) {
      try {
        if (!sale.productName || sale.salePrice <= 0) continue

        const productId = productMap.get(sale.productName.toLowerCase())

        if (productId) {
          const existingSale = await prisma.sale.findFirst({
            where: {
              productId,
              finalPrice: sale.salePrice,
            },
          })

          if (existingSale) continue

          await prisma.sale.create({
            data: {
              productId,
              saleDate: sale.saleDate || new Date(),
              finalPrice: sale.salePrice,
              netProfit: sale.profit,
              platform: sale.platform || "Vinted",
            },
          })

          await prisma.product.update({
            where: { id: productId },
            data: { status: "sold" },
          })

          results.salesImported++
        }
      } catch (error) {
        results.errors.push(`Sale error: ${sale.productName}`)
        console.error("Error importing sale:", error)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Import completed",
      results,
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      { error: "Import failed", details: String(error) },
      { status: 500 }
    )
  }
}
