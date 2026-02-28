"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ThemeMeta, ThemeColors } from "@/lib/themes"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Check, Globe, Twitter, Instagram, Github, Palette, Type, Smartphone, Laptop } from "lucide-react"
import Link from "next/link"
import { FontDef } from "@/lib/fonts"

interface Props { themes: ThemeMeta[], fonts: FontDef[] }

type SidebarTab = "themes" | "typography" | "design"

const CATEGORIES = ["all", "light", "dark", "colorful", "brutal", "minimal"] as const
type Category = (typeof CATEGORIES)[number]

const MOCK = {
  name: "Alex Chen",
  handle: "@alexchen",
  bio: "Designer & developer building things at the intersection of code and craft.",
  links: [
    { icon: "twitter", label: "Twitter / X" },
    { icon: "github", label: "GitHub" },
    { icon: "globe", label: "Portfolio" },
    { icon: "instagram", label: "Instagram" },
  ],
  quote: "Great design is invisible until it isn't.",
}

function MockIcon({ icon }: { icon: string }) {
  const cls = "w-3.5 h-3.5"
  switch (icon) {
    case "twitter": return <Twitter className={cls} />
    case "instagram": return <Instagram className={cls} />
    case "github": return <Github className={cls} />
    default: return <Globe className={cls} />
  }
}

// Resolve the correct color set based on dark mode preference
function resolveColors(theme: ThemeMeta, dark: boolean): ThemeColors {
  return dark && theme.darkColors ? theme.darkColors : theme.colors
}

function ProfilePreview({
  theme,
  dark,
  fontDef,
  size = "md",
  layout = "default",
  spacing = "md",
  borderRadius = "md"
}: {
  theme: ThemeMeta;
  dark: boolean;
  fontDef: FontDef;
  size?: "sm" | "md" | "lg";
  layout?: "default" | "compact" | "cards";
  spacing?: "sm" | "md" | "lg";
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
}) {
  const c = resolveColors(theme, dark)
  // Custom override or use theme default if not set
  const radiusMap = { none: "0px", sm: "4px", md: "8px", lg: "16px", full: "9999px" }
  const radius = borderRadius !== "md" ? radiusMap[borderRadius] : (theme.radius ?? "0.5rem")

  const gapMap = { sm: "0.5rem", md: "1.25rem", lg: "2.5rem" }
  const gap = gapMap[spacing]

  const shadow = theme.shadowStyle === "brutal"
    ? `3px 3px 0 ${c.foreground}`
    : theme.shadowStyle === "none" ? "none" : "0 4px 12px rgba(0,0,0,.08)"

  // User selected font always overrides theme default in playground
  const font = fontDef.family

  return (
    <motion.div
      key={`${theme.id}-${dark}-${fontDef.id}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={`mx-auto bg-background overflow-hidden relative transition-all duration-500 ${size === "sm"
        ? "w-[280px] h-[580px] rounded-[2.5rem] border-[8px] border-zinc-900 shadow-2xl"
        : size === "md"
          ? "w-[450px] h-[700px] rounded-[1.5rem] border-[12px] border-zinc-900 shadow-2xl"
          : "w-[800px] h-[550px] rounded-xl border-[1px] border-border shadow-2xl"
        }`}
      style={{
        borderColor: size === "lg" ? undefined : (dark ? "#333" : "#111"),
      }}
    >
      {size === "lg" && (
        <div className="h-8 border-b border-border bg-muted/30 flex items-center px-3 gap-1.5 shrink-0">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400/50" />
            <div className="w-2 h-2 rounded-full bg-amber-400/50" />
            <div className="w-2 h-2 rounded-full bg-green-400/50" />
          </div>
          <div className="mx-auto h-4 w-60 bg-background/50 rounded-md border border-border/50" />
        </div>
      )}
      <div
        className={`h-full flex flex-col ${layout === "compact" ? "scale-90 origin-top" : ""}`}
        style={{ background: c.background, fontFamily: font, color: c.foreground }}
      >
        {/* fake status bar */}
        <div className="h-7 px-5 flex items-center justify-between" style={{ background: c.background }}>
          <span className="text-[9px] opacity-30" style={{ color: c.foreground }}>9:41</span>
          <span className="text-[9px] opacity-30" style={{ color: c.foreground }}>●●●</span>
        </div>

        <div className={`px-6 pb-8 h-full flex flex-col`} style={{ gap }}>
          {/* Avatar + name */}
          <div className={`flex flex-col items-center gap-2.5 pt-1 ${layout === "compact" ? "scale-90" : ""}`}>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
              style={{ background: c.primary, color: c.primaryForeground }}
            >
              AC
            </div>
            <div className="text-center space-y-0.5">
              <p className="font-bold text-sm" style={{ color: c.foreground }}>{MOCK.name}</p>
              <p className="text-[11px] opacity-50" style={{ color: c.foreground }}>{MOCK.handle}</p>
            </div>
            {layout !== "compact" && (
              <p className="text-[11px] text-center max-w-[180px] leading-relaxed opacity-60"
                style={{ color: c.foreground }}>
                {MOCK.bio}
              </p>
            )}
          </div>

          {/* Links */}
          <div className={`space-y-2 flex-1 ${layout === "cards" ? "space-y-4" : ""}`}>
            {MOCK.links.map((l, i) => (
              <div
                key={l.icon}
                className={`flex items-center gap-2.5 px-4 py-2.5 ${layout === "cards" ? "border" : ""}`}
                style={{
                  background: layout === "cards" ? "transparent" : c.primary,
                  color: layout === "cards" ? c.foreground : c.primaryForeground,
                  borderColor: c.border,
                  borderRadius: `calc(${radius} * 0.9)`,
                  boxShadow: shadow,
                  opacity: layout === "compact" && i > 1 ? 0 : 1
                }}
              >
                <span className="opacity-75 shrink-0"><MockIcon icon={l.icon} /></span>
                <span className="text-xs font-medium flex-1 text-center">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          {layout === "default" && (
            <blockquote
              className="border-l-2 pl-3 py-0.5 text-[11px] italic leading-relaxed"
              style={{ borderLeftColor: c.primary, color: c.mutedForeground || c.foreground, opacity: 0.75 }}
            >
              &ldquo;{MOCK.quote}&rdquo;
            </blockquote>
          )}

          <p className="text-center text-[9px] opacity-20 mt-auto" style={{ color: c.foreground }}>Made with LinkDrop</p>
        </div>
      </div>
    </motion.div>
  )
}

function ThemeCard({
  theme,
  dark,
  selected,
  onSelect,
}: {
  theme: ThemeMeta
  dark: boolean
  selected: boolean
  onSelect: () => void
}) {
  const c = resolveColors(theme, dark)
  const radius = theme.radius ?? "0.5rem"
  const shadow = theme.shadowStyle === "brutal"
    ? `2px 2px 0 ${c.foreground}`
    : "none"

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="rounded-xl overflow-hidden text-left relative border-2 transition-all"
      style={{
        background: c.background,
        borderColor: selected ? "var(--primary)" : "var(--border)",
        boxShadow: selected ? "0 0 0 2px var(--primary-foreground), 0 0 0 4px var(--primary)" : "none",
      }}
    >
      {/* Color bar */}
      <div className="flex h-1.5">
        <div className="flex-[2]" style={{ background: c.background }} />
        <div className="flex-[1]" style={{ background: c.primary }} />
        <div className="w-3" style={{ background: c.accent }} />
      </div>

      {/* Mini preview */}
      <div className="p-2.5 space-y-1.5">
        {/* Avatar row */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full" style={{ background: c.primary }} />
          <div className="space-y-0.5 flex-1">
            <div className="h-1.5 rounded-full w-10" style={{ background: c.foreground, opacity: 0.8 }} />
            <div className="h-1 rounded-full w-6" style={{ background: c.foreground, opacity: 0.35 }} />
          </div>
          {selected && (
            <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
              style={{ background: c.primary }}>
              <Check className="w-2.5 h-2.5" style={{ color: c.primaryForeground }} />
            </div>
          )}
        </div>

        {/* Link bars */}
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-4 flex items-center px-1.5"
            style={{
              background: c.primary,
              borderRadius: `calc(${radius} * 0.6)`,
              opacity: i === 2 ? 0.6 : 1,
              boxShadow: shadow,
            }}
          >
            <div className="h-1 w-8 rounded-full mx-auto" style={{ background: c.primaryForeground, opacity: 0.75 }} />
          </div>
        ))}

        {/* Quote line */}
        <div
          className="h-3 px-1.5 border-l"
          style={{ background: c.accent, borderLeftColor: c.primary, opacity: 0.8 }}
        />
      </div>

      {/* Label */}
      <div className="px-2.5 py-1.5 border-t" style={{ borderColor: c.border, background: c.card }}>
        <p className="text-[10px] font-semibold truncate" style={{ color: c.foreground }}>
          {theme.label}
        </p>
        {theme.fontSans && (
          <p className="text-[9px] opacity-40 truncate mt-px" style={{ color: c.foreground }}>
            {theme.fontSans}
          </p>
        )}
      </div>
    </motion.button>
  )
}

export default function PlaygroundClient({ themes, fonts }: Props) {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]?.id ?? "minimal")
  const [selectedFont, setSelectedFont] = useState(fonts[0]?.id ?? "inter")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<Category>("all")
  const [dark, setDark] = useState(true) // Default to dark preview for sleek dashboard feel
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("themes")
  const [previewSize, setPreviewSize] = useState<"sm" | "md" | "lg">("md")

  // Design state
  const [layout, setLayout] = useState<"default" | "compact" | "cards">("default")
  const [spacing, setSpacing] = useState<"sm" | "md" | "lg">("md")
  const [borderRadius, setBorderRadius] = useState<"none" | "sm" | "md" | "lg" | "full">("md")

  const filtered = useMemo(() =>
    themes.filter((t) => {
      const matchCat = category === "all" || t.category === category
      const matchSearch = !search || t.label.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    }), [themes, search, category])

  const currentTheme = themes.find((t) => t.id === selectedTheme) ?? themes[0]
  const currentFont = fonts.find((f) => f.id === selectedFont) ?? fonts[0]

  return (
    <div className="h-dvh bg-background flex flex-col overflow-hidden selection:bg-primary/20">
      {/* Optional Font Import */}
      {currentFont && currentFont.id !== "geist" && (
        <link rel="stylesheet" href={currentFont.googleImport} />
      )}

      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-primary" />
            <span className="font-bold text-sm tracking-tight hidden sm:inline">Playground</span>
          </Link>
          <div className="h-4 w-px bg-border mx-2" />
          <div className="flex items-center gap-1.5 overflow-hidden font-medium text-xs text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer truncate">{currentTheme.label}</span>
            <span>/</span>
            <span className="hover:text-foreground cursor-pointer truncate">{currentFont.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted p-1 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 text-[10px] ${!dark ? "bg-card shadow-sm" : ""}`}
              onClick={() => setDark(false)}
            >
              Light
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 text-[10px] ${dark ? "bg-card shadow-sm" : ""}`}
              onClick={() => setDark(true)}
            >
              Dark
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* sidebar tab bar icons only */}
        <aside className="w-14 border-r border-border flex flex-col items-center py-4 gap-4 bg-card shrink-0">
          <Button
            variant={sidebarTab === "themes" ? "secondary" : "ghost"}
            size="icon"
            className={`w-10 h-10 rounded-xl ${sidebarTab === "themes" ? "text-primary bg-primary/10 shadow-sm" : "text-muted-foreground"}`}
            onClick={() => setSidebarTab("themes")}
          >
            <Palette className="w-5 h-5" />
          </Button>
          <Button
            variant={sidebarTab === "typography" ? "secondary" : "ghost"}
            size="icon"
            className={`w-10 h-10 rounded-xl ${sidebarTab === "typography" ? "text-primary bg-primary/10 shadow-sm" : "text-muted-foreground"}`}
            onClick={() => setSidebarTab("typography")}
          >
            <Type className="w-5 h-5" />
          </Button>
          <Button
            variant={sidebarTab === "design" ? "secondary" : "ghost"}
            size="icon"
            className={`w-10 h-10 rounded-xl ${sidebarTab === "design" ? "text-primary bg-primary/10 shadow-sm" : "text-muted-foreground"}`}
            onClick={() => setSidebarTab("design")}
          >
            <Palette className="w-5 h-5 rotate-180" /> {/* Using Palette as a proxy for design for now, or use Layout */}
          </Button>
        </aside>

        {/* Tab Content Area */}
        <div className="w-80 border-r border-border flex flex-col bg-card/50 shrink-0 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {sidebarTab === "themes" ? "Theme Library" : sidebarTab === "typography" ? "Typography" : "Design Systems"}
            </h2>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[10px] font-mono opacity-60">
                {sidebarTab === "themes" ? filtered.length : fonts.length} items
              </Badge>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 space-y-6">
              {sidebarTab === "themes" && (
                <>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search themes..."
                        className="pl-8 h-8 text-[11px] bg-background/50"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {CATEGORIES.map((c) => (
                        <Badge
                          key={c}
                          variant={category === c ? "default" : "secondary"}
                          className="cursor-pointer capitalize text-[9px] px-2 py-0.5 rounded-full"
                          onClick={() => setCategory(c)}
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-8">
                    <AnimatePresence mode="popLayout">
                      {filtered.map((t) => (
                        <ThemeCard
                          key={t.id}
                          theme={t}
                          dark={dark}
                          selected={t.id === selectedTheme}
                          onSelect={() => setSelectedTheme(t.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {sidebarTab === "typography" && (
                <div className="space-y-3 pb-8">
                  {fonts.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFont(f.id)}
                      className={`w-full group text-left p-3 rounded-xl border-2 transition-all ${selectedFont === f.id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-background/20 border-border hover:border-primary/30"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${selectedFont === f.id ? "text-primary" : "text-muted-foreground opacity-60"}`}>
                          {f.category}
                        </span>
                        {selectedFont === f.id && <Check className="w-3 h-3 text-primary" />}
                      </div>
                      <p className="text-base truncate" style={{ fontFamily: f.family }}>
                        {f.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 opacity-60">
                        {f.weights.split(";").length} weights · Google Fonts
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {sidebarTab === "design" && (
                <div className="space-y-8 pb-8">
                  {/* Layout Style */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Layout Style</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: "default", label: "Classic Centered", desc: "Standard profile layout" },
                        { id: "compact", label: "Compact Mode", desc: "Dense, tight information" },
                        { id: "cards", label: "Grid Cards", desc: "Separated content blocks" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setLayout(opt.id as any)}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${layout === opt.id
                            ? "bg-primary/5 border-primary shadow-sm"
                            : "bg-background/20 border-border hover:border-primary/20"
                            }`}
                        >
                          <p className="text-xs font-bold">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacing */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Spacing</label>
                    <div className="flex bg-muted p-1 rounded-lg">
                      {["sm", "md", "lg"].map((v) => (
                        <button
                          key={v}
                          onClick={() => setSpacing(v as any)}
                          className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${spacing === v ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Corner Radius</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {["none", "sm", "md", "lg", "full"].map((v) => (
                        <button
                          key={v}
                          onClick={() => setBorderRadius(v as any)}
                          className={`h-8 flex items-center justify-center rounded-md border-2 transition-all ${borderRadius === v ? "border-primary bg-primary/5" : "border-border hover:border-primary/20 text-muted-foreground"}`}
                        >
                          <div className={`w-3 h-3 border-t-2 border-l-2 border-current ${v === "none" ? "" :
                            v === "sm" ? "rounded-tl-sm" :
                              v === "md" ? "rounded-tl-md" :
                                v === "lg" ? "rounded-tl-lg" : "rounded-tl-full"
                            }`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-border bg-card/80">
            <Link href="/create" className="w-full">
              <Button className="w-full gap-2 h-9 text-xs press gradient-text border-primary/20 bg-primary/5 hover:bg-primary/10">
                Create new template
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Workspace Preview area */}
        <main className="flex-1 bg-zinc-50 dark:bg-zinc-950/40 relative flex flex-col overflow-hidden">
          {/* Workspace bar */}
          <div className="h-10 border-b border-border bg-card/60 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-1 bg-muted p-0.5 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-8 p-0 ${previewSize === "sm" ? "bg-card shadow-sm" : "opacity-40"}`}
                onClick={() => setPreviewSize("sm")}
              >
                <Smartphone className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-8 p-0 ${previewSize === "md" ? "bg-card shadow-sm" : "opacity-40"}`}
                onClick={() => setPreviewSize("md")}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 w-8 p-0 ${previewSize === "lg" ? "bg-card shadow-sm" : "opacity-40"}`}
                onClick={() => setPreviewSize("lg")}
              >
                <Laptop className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 pr-2">
            </div>
          </div>

          {/* Canvas area - Scrollable */}
          <div className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950/20">
            <div className="min-h-full w-full flex items-center justify-center p-8 md:p-12 lg:p-20">
              {currentTheme && (
                <div className="flex items-center justify-center w-full h-full">
                  <ProfilePreview
                    theme={currentTheme}
                    dark={dark}
                    fontDef={currentFont}
                    size={previewSize}
                    layout={layout}
                    spacing={spacing}
                    borderRadius={borderRadius}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Zoom/Status bar */}
          <div className="h-7 border-t border-border bg-card/60 backdrop-blur-sm flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-4 text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
              <span>Ready</span>
              <span className="opacity-40 text-xs">·</span>
              <span>Layer: Profile-Card</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                <span>100%</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
