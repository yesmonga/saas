-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "brand" TEXT,
    "condition" TEXT NOT NULL DEFAULT 'new_with_tags',
    "purchasePrice" REAL NOT NULL,
    "additionalFees" REAL NOT NULL DEFAULT 0,
    "totalCost" REAL NOT NULL,
    "sellingPrice" REAL NOT NULL DEFAULT 0,
    "margin" REAL NOT NULL DEFAULT 0,
    "marginPercent" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'in_stock',
    "vintedUrl" TEXT,
    "vintedViews" INTEGER NOT NULL DEFAULT 0,
    "vintedFavorites" INTEGER NOT NULL DEFAULT 0,
    "vintedListedAt" DATETIME,
    "ebayUrl" TEXT,
    "leboncoinUrl" TEXT,
    "beebsUrl" TEXT,
    "purchaseDate" DATETIME,
    "purchaseSource" TEXT,
    "dateHome" DATETIME,
    "notes" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "amazonEmail" TEXT,
    "amazonOrderId" TEXT,
    "amazonStatus" TEXT,
    "notionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "saleDate" DATETIME NOT NULL,
    "finalPrice" REAL NOT NULL,
    "platformFees" REAL NOT NULL DEFAULT 0,
    "shippingCost" REAL NOT NULL DEFAULT 0,
    "netProfit" REAL NOT NULL,
    "platform" TEXT NOT NULL,
    "buyerName" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AmazonOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "purchaseDate" DATETIME,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isShipped" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "orderId" TEXT,
    "productId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "userName" TEXT NOT NULL DEFAULT 'Alex',
    "userEmail" TEXT,
    "vintedProfile" TEXT,
    "ebayProfile" TEXT,
    "githubRepo" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "language" TEXT NOT NULL DEFAULT 'fr',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "defaultVintedFees" REAL NOT NULL DEFAULT 5,
    "defaultEbayFees" REAL NOT NULL DEFAULT 10,
    "defaultLeboncoinFees" REAL NOT NULL DEFAULT 0,
    "defaultBeebsFees" REAL NOT NULL DEFAULT 8
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_notionId_key" ON "Product"("notionId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
