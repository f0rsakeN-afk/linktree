"use client"

import { FontDef } from "@/lib/fonts"
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Props {
  fonts: FontDef[]
  current: string
  onSelect: (id: string) => void
}

const CATEGORIES = ["all", "sans", "serif", "mono", "display"] as const

export default function FontPicker({ fonts, current, onSelect }: Props) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all")

  const filtered = category === "all" ? fonts : fonts.filter((f) => f.category === category)

  return (
    <div className="space-y-4">
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

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filtered.map((font) => (
          <button
            key={font.id}
            onClick={() => onSelect(font.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all hover:bg-muted/50 ${
              current === font.id
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
          >
            <div className="space-y-0.5">
              <p
                className="text-base font-medium leading-none"
                style={{ fontFamily: font.family }}
              >
                {font.label}
              </p>
              <p
                className="text-sm text-muted-foreground leading-snug"
                style={{ fontFamily: font.family }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <Badge variant="outline" className="text-xs capitalize">
                {font.category}
              </Badge>
              {current === font.id && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
