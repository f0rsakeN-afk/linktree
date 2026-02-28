"use client"

import { useState, useMemo } from "react"
import { ThemeMeta } from "@/lib/themes"
import { Check, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Props {
  themes: ThemeMeta[]
  current: string
  onSelect: (id: string) => void
}

const CATEGORIES = ["all", "light", "dark", "colorful", "brutal", "minimal"] as const

function ThemeCard({
  theme,
  selected,
  onSelect,
}: {
  theme: ThemeMeta
  selected: boolean
  onSelect: () => void
}) {
  const { colors, radius = "0.625rem", shadowStyle = "soft" } = theme

  const cardStyle = {
    "--t-bg": colors.background,
    "--t-fg": colors.foreground,
    "--t-primary": colors.primary,
    "--t-primary-fg": colors.primaryForeground,
    "--t-accent": colors.accent,
    "--t-border": colors.border,
    "--t-card": colors.card,
    "--t-radius": radius,
  } as React.CSSProperties

  const shadow =
    shadowStyle === "brutal"
      ? "3px 3px 0px var(--t-fg)"
      : shadowStyle === "none"
      ? "none"
      : "0 2px 8px rgba(0,0,0,.08)"

  return (
    <button
      onClick={onSelect}
      className={`relative group rounded-xl border-2 overflow-hidden text-left transition-all duration-200 hover:scale-[1.02] ${
        selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"
      }`}
      style={{ background: colors.background }}
      aria-label={`Select ${theme.label} theme`}
    >
      {/* Mini profile preview */}
      <div style={cardStyle} className="p-3 space-y-2">
        {/* Avatar + name */}
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full shrink-0"
            style={{ background: colors.primary }}
          />
          <div className="space-y-0.5 flex-1">
            <div
              className="h-2 rounded-full w-16"
              style={{ background: colors.foreground, opacity: 0.9 }}
            />
            <div
              className="h-1.5 rounded-full w-10"
              style={{ background: colors.foreground, opacity: 0.4 }}
            />
          </div>
        </div>

        {/* Link blocks */}
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-6 rounded flex items-center px-2"
            style={{
              background: colors.primary,
              borderRadius: `calc(${radius} * 0.8)`,
              boxShadow: shadow,
              opacity: i === 2 ? 0.7 : 1,
            }}
          >
            <div className="h-1.5 rounded-full w-12" style={{ background: colors.primaryForeground, opacity: 0.8 }} />
          </div>
        ))}

        {/* Quote block */}
        <div
          className="h-5 rounded px-2 border-l-2"
          style={{
            background: colors.accent,
            borderLeftColor: colors.primary,
            borderRadius: `calc(${radius} * 0.5)`,
          }}
        />
      </div>

      {/* Label */}
      <div
        className="px-3 py-2 border-t"
        style={{
          borderColor: colors.border,
          background: colors.card,
        }}
      >
        <span className="text-xs font-medium" style={{ color: colors.foreground }}>
          {theme.label}
        </span>
        {theme.fontSans && (
          <span className="text-xs ml-1.5 opacity-50" style={{ color: colors.foreground }}>
            {theme.fontSans.split(",")[0].replace(/['"]/g, "").trim()}
          </span>
        )}
      </div>

      {/* Selected check */}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
    </button>
  )
}

export default function ThemePicker({ themes, current, onSelect }: Props) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all")

  const filtered = useMemo(() => {
    return themes.filter((t) => {
      const matchCat = category === "all" || t.category === category
      const matchSearch =
        !search || t.label.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [themes, search, category])

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search themes…"
          className="pl-9 h-9"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "secondary"}
            className="cursor-pointer capitalize text-xs"
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1 pb-1">
        {filtered.map((t) => (
          <ThemeCard
            key={t.id}
            theme={t}
            selected={t.id === current}
            onSelect={() => onSelect(t.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center text-sm text-muted-foreground py-8">
            No themes match your search
          </div>
        )}
      </div>
    </div>
  )
}
