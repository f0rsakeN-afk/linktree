export interface FontDef {
  id: string
  label: string
  family: string
  googleImport: string
  category: "sans" | "serif" | "mono" | "display"
  weights: string
}

export const FONTS: FontDef[] = [
  {
    id: "inter",
    label: "Inter",
    family: "'Inter', sans-serif",
    googleImport: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    category: "sans",
    weights: "300;400;500;600;700",
  },
  {
    id: "geist",
    label: "Geist",
    family: "'Geist', sans-serif",
    googleImport: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap",
    category: "sans",
    weights: "300;400;500;600;700",
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    family: "'DM Sans', sans-serif",
    googleImport: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap",
    category: "sans",
    weights: "300;400;500;600;700",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    family: "'Space Grotesk', sans-serif",
    googleImport: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
    category: "sans",
    weights: "300;400;500;600;700",
  },
  {
    id: "outfit",
    label: "Outfit",
    family: "'Outfit', sans-serif",
    googleImport: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
    category: "sans",
    weights: "300;400;500;600;700",
  },
  {
    id: "syne",
    label: "Syne",
    family: "'Syne', sans-serif",
    googleImport: "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap",
    category: "display",
    weights: "400;500;600;700;800",
  },
  {
    id: "playfair",
    label: "Playfair Display",
    family: "'Playfair Display', serif",
    googleImport: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
    category: "serif",
    weights: "400;500;600;700",
  },
  {
    id: "lora",
    label: "Lora",
    family: "'Lora', serif",
    googleImport: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",
    category: "serif",
    weights: "400;500;600;700",
  },
  {
    id: "raleway",
    label: "Raleway",
    family: "'Raleway', sans-serif",
    googleImport: "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap",
    category: "display",
    weights: "300;400;500;600;700",
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    family: "'JetBrains Mono', monospace",
    googleImport: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
    category: "mono",
    weights: "400;500;700",
  },
  {
    id: "space-mono",
    label: "Space Mono",
    family: "'Space Mono', monospace",
    googleImport: "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap",
    category: "mono",
    weights: "400;700",
  },
  {
    id: "cabinet-grotesk",
    label: "Cabinet Grotesk",
    family: "'Cabinet Grotesk', sans-serif",
    googleImport: "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700&display=swap",
    category: "display",
    weights: "400;500;700",
  },
]

export function getFontById(id: string): FontDef | undefined {
  return FONTS.find((f) => f.id === id)
}

export const DEFAULT_FONT = "inter"
