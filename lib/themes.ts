import { readFileSync } from "fs"
import { join } from "path"

export interface ThemeColors {
  background: string
  foreground: string
  primary: string
  primaryForeground: string
  accent: string
  border: string
  card: string
  mutedForeground: string
}

export interface ThemeMeta {
  id: string
  label: string
  category: "light" | "dark" | "colorful" | "brutal" | "minimal"
  colors: ThemeColors       // light (:root) colors
  darkColors?: ThemeColors  // dark (.dark) colors
  fontSans?: string
  radius?: string
  shadowStyle?: "none" | "soft" | "brutal"
}

function parseVar(css: string, varName: string): string {
  const re = new RegExp(`${varName}\\s*:\\s*([^;\\n]+);`)
  return css.match(re)?.[1]?.trim() ?? ""
}

function extractBlock(css: string, selector: string): string {
  const re = new RegExp(`${selector}\\s*\\{([^}]+)\\}`)
  return css.match(re)?.[1] ?? ""
}

function parseColors(block: string): ThemeColors {
  return {
    background:      parseVar(block, "--background"),
    foreground:      parseVar(block, "--foreground"),
    primary:         parseVar(block, "--primary"),
    primaryForeground: parseVar(block, "--primary-foreground"),
    accent:          parseVar(block, "--accent"),
    border:          parseVar(block, "--border"),
    card:            parseVar(block, "--card"),
    mutedForeground: parseVar(block, "--muted-foreground"),
  }
}

function parseFontSans(css: string): string | undefined {
  const val = parseVar(css, "--font-sans")
  if (!val) return undefined
  return val.split(",")[0].replace(/['"]/g, "").trim()
}

function parseShadowStyle(block: string): "none" | "soft" | "brutal" {
  const x    = parseFloat(parseVar(block, "--shadow-x") || "0")
  const blur = parseFloat(parseVar(block, "--shadow-blur") || "0")
  if (blur === 0 && x !== 0) return "brutal"
  if (x === 0 && blur === 0) return "none"
  return "soft"
}

function loadTheme(file: string): Omit<ThemeMeta, "id" | "label" | "category"> {
  const cssDir = join(process.cwd(), "app", "css")
  const css = readFileSync(join(cssDir, file), "utf-8")

  const rootBlock = extractBlock(css, ":root")
  const darkBlock = extractBlock(css, "\\.dark")

  const colors     = parseColors(rootBlock || css)
  const darkColors = darkBlock ? parseColors(darkBlock) : undefined
  const fontSans   = parseFontSans(rootBlock || css)
  const radius     = parseVar(rootBlock || css, "--radius") || "0.625rem"
  const shadowStyle = parseShadowStyle(rootBlock || css)

  return { colors, darkColors, fontSans, radius, shadowStyle }
}

const THEME_DEFS: Pick<ThemeMeta, "id" | "label" | "category">[] = [
  { id: "minimal",    label: "Minimal",      category: "minimal"   },
  { id: "modern",     label: "Modern",       category: "light"     },
  { id: "dark",       label: "Dark",         category: "dark"      },
  { id: "darkforge",  label: "Darkforge",    category: "dark"      },
  { id: "rosepine",   label: "Rosé Pine",    category: "dark"      },
  { id: "terminal",   label: "Terminal",     category: "dark"      },
  { id: "brutal",     label: "Brutalist",    category: "brutal"    },
  { id: "bold",       label: "Bold",         category: "brutal"    },
  { id: "manga",      label: "Manga",        category: "colorful"  },
  { id: "vtron",      label: "V-Tron",       category: "colorful"  },
  { id: "spaceliner", label: "Spaceliner",   category: "colorful"  },
  { id: "purple",     label: "Purple",       category: "colorful"  },
  { id: "tealhue",    label: "Teal Hue",     category: "colorful"  },
  { id: "sage",       label: "Sage",         category: "light"     },
  { id: "burgundy",   label: "Burgundy",     category: "light"     },
  { id: "zen",        label: "Zen",          category: "minimal"   },
  { id: "portfolio",  label: "Portfolio",    category: "light"     },
  { id: "claude",     label: "Claude",       category: "light"     },
  { id: "cwh",        label: "CWH",          category: "light"     },
  { id: "design",     label: "Design",       category: "light"     },
  { id: "lead",       label: "Lead",         category: "dark"      },
  { id: "paste",      label: "Paste",        category: "light"     },
  { id: "qraft",      label: "Qraft",        category: "light"     },
  { id: "playable",   label: "Playable",     category: "colorful"  },
  { id: "stella",     label: "Stella",       category: "light"     },
  { id: "nlan",       label: "Nlan",         category: "colorful"  },
  { id: "offworld",   label: "Offworld",     category: "dark"      },
  { id: "s3karo",     label: "S3karo",       category: "colorful"  },
  { id: "mytheme",    label: "My Theme",     category: "light"     },
  { id: "awesome",    label: "Awesome",      category: "colorful"  },
  { id: "autoblog",   label: "Autoblog",     category: "light"     },
  { id: "exam",       label: "Exam",         category: "minimal"   },
  { id: "2077",       label: "2077",         category: "colorful"  },
  { id: "astro",      label: "Astro",        category: "colorful"  },
  { id: "hyprred",    label: "Hypr Red",     category: "colorful"  },
  { id: "blueyellow", label: "Blue & Yellow",category: "colorful"  },
]

let _registry: ThemeMeta[] | null = null

export function getThemeRegistry(): ThemeMeta[] {
  if (_registry) return _registry

  _registry = THEME_DEFS.map((def) => {
    try {
      return { ...def, ...loadTheme(`${def.id}.css`) }
    } catch {
      const fallback: ThemeColors = {
        background: "oklch(1 0 0)", foreground: "oklch(0.15 0 0)",
        primary: "oklch(0.45 0.18 265)", primaryForeground: "oklch(1 0 0)",
        accent: "oklch(0.94 0.02 248)", border: "oklch(0.91 0 0)",
        card: "oklch(0.98 0 0)", mutedForeground: "oklch(0.55 0 0)",
      }
      return { ...def, colors: fallback }
    }
  })

  return _registry
}

export function getThemeById(id: string): ThemeMeta | undefined {
  return getThemeRegistry().find((t) => t.id === id)
}

export function getThemeCss(id: string): string {
  try {
    return readFileSync(join(process.cwd(), "app", "css", `${id}.css`), "utf-8")
  } catch {
    return ""
  }
}

export const DEFAULT_THEME = "minimal"
