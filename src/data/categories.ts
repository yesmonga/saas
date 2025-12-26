export const defaultCategories = [
  { name: "Pokemon", color: "#FFD700", icon: "⚡" },
  { name: "Pop Mart", color: "#FF69B4", icon: "🎀" },
  { name: "Sneakers", color: "#4CAF50", icon: "👟" },
  { name: "Figurines & Collectibles", color: "#9C27B0", icon: "🎭" },
  { name: "Vêtements", color: "#2196F3", icon: "👕" },
  { name: "Vinyles & Musique", color: "#E91E63", icon: "🎵" },
  { name: "Jouets & Poupées", color: "#FF5722", icon: "🎎" },
  { name: "Trading Cards", color: "#795548", icon: "🃏" },
  { name: "Accessoires", color: "#607D8B", icon: "💎" },
  { name: "Mattel", color: "#F44336", icon: "🎪" },
  { name: "Lorcana", color: "#3F51B5", icon: "✨" },
  { name: "Autres", color: "#9E9E9E", icon: "📦" },
]

export const categoryColors: Record<string, string> = {
  Pokemon: "#FFD700",
  "Pop Mart": "#FF69B4",
  Sneakers: "#4CAF50",
  "Figurines & Collectibles": "#9C27B0",
  Vêtements: "#2196F3",
  "Vinyles & Musique": "#E91E63",
  "Jouets & Poupées": "#FF5722",
  "Trading Cards": "#795548",
  Accessoires: "#607D8B",
  Mattel: "#F44336",
  Lorcana: "#3F51B5",
  Autres: "#9E9E9E",
}

export function getCategoryColor(category: string): string {
  return categoryColors[category] || "#9E9E9E"
}
