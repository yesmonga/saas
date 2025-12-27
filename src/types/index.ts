export interface Product {
  id: string
  title: string
  description?: string | null
  photos: string[]
  category: string
  subcategory?: string | null
  brand?: string | null
  condition: string
  
  purchasePrice: number
  additionalFees: number
  totalCost: number
  sellingPrice: number
  margin: number
  marginPercent: number
  
  status: string
  
  vintedUrl?: string | null
  vintedViews: number
  vintedFavorites: number
  vintedListedAt?: Date | null
  ebayUrl?: string | null
  leboncoinUrl?: string | null
  beebsUrl?: string | null
  
  purchaseDate?: Date | null
  purchaseSource?: string | null
  dateHome?: Date | null
  notes?: string | null
  tags: string[]
  
  amazonEmail?: string | null
  amazonOrderId?: string | null
  amazonStatus?: string | null
  
  notionId?: string | null
  
  createdAt: Date
  updatedAt: Date
}

export interface Sale {
  id: string
  productId: string
  product?: Product
  saleDate: Date
  finalPrice: number
  platformFees: number
  shippingCost: number
  netProfit: number
  platform: string
  buyerName?: string | null
  notes?: string | null
  createdAt: Date
}

export interface AmazonOrder {
  id: string
  email: string
  productName: string
  price: number
  purchaseDate?: Date | null
  isBanned: boolean
  isPaid: boolean
  isShipped: boolean
  status?: string | null
  orderId?: string | null
  productId?: string | null
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  icon?: string | null
  createdAt: Date
}

export interface Settings {
  id: string
  userName: string
  userEmail?: string | null
  vintedProfile?: string | null
  ebayProfile?: string | null
  githubRepo?: string | null
  theme: string
  language: string
  currency: string
  defaultVintedFees: number
  defaultEbayFees: number
  defaultLeboncoinFees: number
  defaultBeebsFees: number
}

export interface DashboardStats {
  stockValue: number
  inStockCount: number
  soldCount: number
  soldThisMonth: number
  soldLastMonth: number
  revenue: number
  revenueThisMonth: number
  revenueLastMonth: number
  netProfit: number
  profitThisMonth: number
  profitLastMonth: number
  // Percentage changes vs last month
  revenueChange: number
  profitChange: number
  soldChange: number
  averageMargin: number
  totalInvestment: number
  roi: number
  totalViews: number
  totalFavorites: number
}

export interface SalesChartData {
  date: string
  sales: number
  revenue: number
}

export interface CategoryDistribution {
  name: string
  value: number
  color: string
}

export type ProductStatus = 'draft' | 'in_stock' | 'listed' | 'reserved' | 'sold'
export type ProductCondition = 'new_with_tags' | 'new_without_tags' | 'very_good' | 'good' | 'satisfactory'
export type Platform = 'vinted' | 'ebay' | 'leboncoin' | 'beebs'
