import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const stockProducts = [
  { title: "Coffret Pokémon Super-Premium EV8.5 Évolutions Prismatiques", purchasePrice: 119, category: "Pokemon", purchaseDate: "2025-05-22", dateHome: "2025-09-29" },
  { title: "Coffret Pokémon Super-Premium EV8.5 Évolutions Prismatiques", purchasePrice: 130, category: "Pokemon", purchaseDate: "2025-05-22", dateHome: "2025-09-29" },
  { title: "Pop Mart - MOLLY – Peekaboo", purchasePrice: 72, category: "Pop Mart", purchaseDate: "2025-06-12", dateHome: "2025-09-29" },
  { title: "ASICS SportStyle GEL-1130 GS Pink", purchasePrice: 68, category: "Sneakers", purchaseDate: "2025-06-13", dateHome: "2025-09-29" },
  { title: "Pop Mart Cry x1 boite", purchasePrice: 16.80, category: "Pop Mart", purchaseDate: "2025-06-22", dateHome: "2025-09-29" },
  { title: "Pop Mart Cry x1 boite", purchasePrice: 16.80, category: "Pop Mart", purchaseDate: "2025-06-22", dateHome: "2025-09-29" },
  { title: "Pop Mart Cry Whole Set", purchasePrice: 100.80, category: "Pop Mart", purchaseDate: "2025-06-22", dateHome: "2025-09-29" },
  { title: "Pop Mart Cry Whole Set", purchasePrice: 100.80, category: "Pop Mart", purchaseDate: "2025-06-22", dateHome: "2025-09-29" },
  { title: "Pop Mart Cry Whole Set", purchasePrice: 100.80, category: "Pop Mart", purchaseDate: "2025-06-22", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-01", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-02", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Beige", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Bleu", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Vert", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Beige", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Gris", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Marron", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Exciting Macaron Box Rare", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Big into Energy Box Vert", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Have a Seat Box Violet", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Have a Seat Box Gris", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Have a Seat Box Beige", purchasePrice: 20, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Fall in Wild", purchasePrice: 28.80, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Fall in Wild", purchasePrice: 28.80, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "Pop Mart Hacipupu Whole Box", purchasePrice: 137, category: "Pop Mart", purchaseDate: "2025-07-05", dateHome: "2025-09-29" },
  { title: "New Balance 740 Creme 37", purchasePrice: 90, category: "Sneakers", purchaseDate: "2025-07-06", dateHome: "2025-09-29" },
  { title: "Pop Mart - Exciting Macaron Whole Box", purchasePrice: 120, category: "Pop Mart", purchaseDate: "2025-07-07", dateHome: "2025-09-29" },
  { title: "Pop Mart - Exciting Macaron Whole Box", purchasePrice: 120, category: "Pop Mart", purchaseDate: "2025-07-07", dateHome: "2025-09-29" },
  { title: "Pop Mart - Exciting Macaron Whole Box", purchasePrice: 120, category: "Pop Mart", purchaseDate: "2025-07-07", dateHome: "2025-09-29" },
  { title: "Pop Mart - Exciting Macaron Whole Box", purchasePrice: 120, category: "Pop Mart", purchaseDate: "2025-07-07", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-09", dateHome: "2025-09-29" },
  { title: "Pop Mart Hirono Living", purchasePrice: 32.40, category: "Pop Mart", purchaseDate: "2025-07-09", dateHome: "2025-09-29" },
  { title: "Disney Lorcana: The First Chapter Booster Display", purchasePrice: 144, category: "Lorcana", purchaseDate: "2025-07-10", dateHome: "2025-09-29" },
  { title: "Disney Lorcana: The First Chapter Booster Display", purchasePrice: 144, category: "Lorcana", purchaseDate: "2025-07-10", dateHome: "2025-09-29" },
  { title: "KAWS Chul-Su Figure (Coloured)", purchasePrice: 460, category: "Figurines & Collectibles", purchaseDate: "2025-07-13", dateHome: "2025-09-29" },
  { title: "Salomon xt 6 white fairy tale almond milk", purchasePrice: 100.76, category: "Sneakers", purchaseDate: "2025-07-13", dateHome: "2025-09-29" },
  { title: "adidas Originals x ASOS - Veste de survêtement Fleur", purchasePrice: 145.99, category: "Vêtements", purchaseDate: "2025-07-18", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Noir", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Blanche", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Blanche", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "ETB Flamme Blanche", purchasePrice: 55.99, category: "Pokemon", purchaseDate: "2025-07-23", dateHome: "2025-09-29" },
  { title: "New Balance Purple 740CG2", purchasePrice: 78, category: "Sneakers", purchaseDate: "2025-07-25", dateHome: "2025-09-29" },
  { title: "Salomon xt-6 ghost gray", purchasePrice: 104, category: "Sneakers", purchaseDate: "2025-08-11", dateHome: "2025-09-29" },
  { title: "Salomon Sportstyle XT-6 GTX Carbon Vanilla Ice", purchasePrice: 100, category: "Sneakers", purchaseDate: "2025-08-11", dateHome: "2025-09-29" },
  { title: "United States Mint – 250th Anniversary United States Navy", purchasePrice: 110, category: "Accessoires", purchaseDate: "2025-10-29", dateHome: "2025-10-29" },
  { title: "Monster High Skullector The Shining Grady Twins", purchasePrice: 105, category: "Figurines & Collectibles", purchaseDate: "2025-11-16", dateHome: null },
  { title: "Ensemble de pin's Winnie l'Ourson et Éfélant", purchasePrice: 35, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: "2025-11-18" },
  { title: "Folklore Album Cardigan Plush Cat", purchasePrice: 49, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: null },
  { title: "Folklore Album Cardigan Plush Cat", purchasePrice: 49, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: null },
  { title: "Folklore Album Cardigan Plush Cat", purchasePrice: 49, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: null },
  { title: "The Life of a Showgirl Vinyl Case", purchasePrice: 103, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: null },
  { title: "The Life of a Showgirl Vinyl Case", purchasePrice: 103, category: "Accessoires", purchaseDate: "2025-11-16", dateHome: null },
]

async function main() {
  console.log("🌱 Seeding database...")

  // Clear existing data
  await prisma.sale.deleteMany()
  await prisma.amazonOrder.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  const categories = [
    { name: "Pokemon", color: "#FFCB05" },
    { name: "Pop Mart", color: "#FF6B9D" },
    { name: "Sneakers", color: "#4ECDC4" },
    { name: "Figurines & Collectibles", color: "#9B59B6" },
    { name: "Vêtements", color: "#3498DB" },
    { name: "Lorcana", color: "#1ABC9C" },
    { name: "Accessoires", color: "#E67E22" },
    { name: "Trading Cards", color: "#F39C12" },
    { name: "Mattel", color: "#E74C3C" },
    { name: "Autres", color: "#95A5A6" },
  ]

  for (const cat of categories) {
    await prisma.category.create({ data: cat })
  }
  console.log(`✅ Created ${categories.length} categories`)

  // Create products
  for (const product of stockProducts) {
    await prisma.product.create({
      data: {
        title: product.title,
        purchasePrice: product.purchasePrice,
        totalCost: product.purchasePrice,
        sellingPrice: Math.round(product.purchasePrice * 1.4),
        category: product.category,
        status: "in_stock",
        condition: "new_with_tags",
        purchaseDate: product.purchaseDate ? new Date(product.purchaseDate) : null,
        dateHome: product.dateHome ? new Date(product.dateHome) : null,
      },
    })
  }
  console.log(`✅ Created ${stockProducts.length} products`)

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
