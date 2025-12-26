import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function calculateMargin(purchasePrice: number, sellingPrice: number): { margin: number; marginPercent: number } {
  const margin = sellingPrice - purchasePrice
  const marginPercent = purchasePrice > 0 ? (margin / purchasePrice) * 100 : 0
  return { margin, marginPercent }
}

export function getMarginColor(marginPercent: number): string {
  if (marginPercent >= 30) return 'text-green-500'
  if (marginPercent >= 15) return 'text-yellow-500'
  return 'text-red-500'
}

export function getMarginBadge(marginPercent: number): { color: string; label: string } {
  if (marginPercent >= 30) return { color: 'bg-green-500/20 text-green-500', label: '🟢 ROI High' }
  if (marginPercent >= 15) return { color: 'bg-yellow-500/20 text-yellow-500', label: '🟡 ROI Medium' }
  return { color: 'bg-red-500/20 text-red-500', label: '🔴 ROI Low' }
}

export function parsePrice(priceStr: string): number {
  if (!priceStr) return 0
  const cleaned = priceStr.replace(/[€$,\s]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  
  // Try DD/MM/YYYY format
  const ddmmyyyy = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (ddmmyyyy) {
    return new Date(parseInt(ddmmyyyy[3]), parseInt(ddmmyyyy[2]) - 1, parseInt(ddmmyyyy[1]))
  }
  
  // Try "Month DD, YYYY" format
  const monthDayYear = dateStr.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/)
  if (monthDayYear) {
    return new Date(dateStr)
  }
  
  // Try ISO format
  const parsed = new Date(dateStr)
  if (!isNaN(parsed.getTime())) {
    return parsed
  }
  
  return null
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Brouillon',
    in_stock: 'En stock',
    listed: 'En vente',
    reserved: 'Réservé',
    sold: 'Vendu',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    in_stock: 'bg-blue-500/20 text-blue-400',
    listed: 'bg-purple-500/20 text-purple-400',
    reserved: 'bg-yellow-500/20 text-yellow-400',
    sold: 'bg-green-500/20 text-green-400',
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400'
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    new_with_tags: 'Neuf avec étiquette',
    new_without_tags: 'Neuf sans étiquette',
    very_good: 'Très bon état',
    good: 'Bon état',
    satisfactory: 'Satisfaisant',
  }
  return labels[condition] || condition
}

export function getDaysInStock(dateHome: Date | null, soldDate?: Date | null): number {
  if (!dateHome) return 0
  const endDate = soldDate || new Date()
  const diffTime = Math.abs(endDate.getTime() - dateHome.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
