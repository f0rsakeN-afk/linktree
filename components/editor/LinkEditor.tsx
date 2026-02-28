"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import PlatformIcon from "@/components/PlatformIcon"
import { PLATFORMS, PLATFORM_CATEGORIES, getPlatformById, Platform } from "@/lib/platforms"
import { LinkItem } from "@/lib/types"
import { Plus, Trash2, ChevronUp, ChevronDown, Search, ExternalLink } from "lucide-react"

interface Props {
  links: LinkItem[]
  onChange: (links: LinkItem[]) => void
}

// ── Platform picker modal ────────────────────────────────────────────────────

function PlatformPicker({ onSelect, onClose }: { onSelect: (p: Platform) => void; onClose: () => void }) {
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState<string>("all")

  const filtered = PLATFORMS.filter((p) => {
    const matchCat = cat === "all" || p.category === cat
    const matchSearch = !search || p.label.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search platforms…"
          className="pl-9 h-9"
          autoFocus
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap">
        <Badge
          variant={cat === "all" ? "default" : "secondary"}
          className="cursor-pointer text-xs"
          onClick={() => setCat("all")}
        >
          All
        </Badge>
        {PLATFORM_CATEGORIES.map((c) => (
          <Badge
            key={c.id}
            variant={cat === c.id ? "default" : "secondary"}
            className="cursor-pointer text-xs"
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </Badge>
        ))}
      </div>

      {/* Platform grid */}
      <ScrollArea className="h-72">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pr-2">
          {filtered.map((platform) => (
            <motion.button
              key={platform.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { onSelect(platform); onClose() }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border bg-card text-left hover:border-primary/40 hover:bg-muted/50 transition-colors"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white"
                style={{ background: platform.color }}
              >
                <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium leading-tight truncate">{platform.label}</span>
            </motion.button>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-3 text-center text-sm text-muted-foreground py-8">
              No platforms found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// ── Single link row ──────────────────────────────────────────────────────────

function LinkRow({
  link,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  link: LinkItem
  onUpdate: (l: LinkItem) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const platform = link.icon ? getPlatformById(link.icon) : undefined

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-border/80 transition-colors"
    >
      {/* Platform icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
        style={{ background: platform?.color ?? "#6B7280" }}
      >
        {platform
          ? <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
          : <span className="text-[10px] font-bold">?</span>
        }
      </div>

      {/* Fields */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-xs font-semibold text-foreground truncate">
          {platform?.label ?? link.title ?? "Custom link"}
        </p>
        <Input
          value={link.url}
          onChange={(e) => onUpdate({ ...link, url: e.target.value })}
          placeholder={platform?.placeholder ?? "https://"}
          className="h-6 text-xs border-0 shadow-none bg-transparent px-0 focus-visible:ring-0 text-muted-foreground font-mono placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Actions — only visible on hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {link.url && (
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ExternalLink className="w-3 h-3" />
            </button>
          </a>
        )}
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-25"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-25"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function LinkEditor({ links, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)

  function addPlatform(p: Platform) {
    const newLink: LinkItem = {
      title: p.label,
      url: "",
      icon: p.id,
      order: links.length,
    }
    onChange([...links, newLink])
  }

  function updateLink(index: number, updated: LinkItem) {
    onChange(links.map((l, i) => (i === index ? updated : l)))
  }

  function deleteLink(index: number) {
    onChange(links.filter((_, i) => i !== index).map((l, i) => ({ ...l, order: i })))
  }

  function move(index: number, dir: "up" | "down") {
    const next = [...links]
    const swap = dir === "up" ? index - 1 : index + 1
      ;[next[index], next[swap]] = [next[swap], next[index]]
    onChange(next.map((l, i) => ({ ...l, order: i })))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Links</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {links.length === 0 ? "Add your social profiles and websites" : `${links.length} link${links.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {links.map((link, i) => (
          <LinkRow
            key={link.id ?? `new-${i}`}
            link={link}
            onUpdate={(u) => updateLink(i, u)}
            onDelete={() => deleteLink(i)}
            onMoveUp={() => move(i, "up")}
            onMoveDown={() => move(i, "down")}
            isFirst={i === 0}
            isLast={i === links.length - 1}
          />
        ))}
      </AnimatePresence>

      {links.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2 py-10 border border-dashed border-border rounded-xl text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No links yet</p>
          <p className="text-xs text-muted-foreground/60">Click below to pick a platform</p>
        </motion.div>
      )}

      <Button
        variant="outline"
        className="w-full gap-2 border-dashed h-9 text-sm"
        onClick={() => setPickerOpen(true)}
      >
        <Plus className="w-3.5 h-3.5" />
        Add link
      </Button>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pick a platform</DialogTitle>
          </DialogHeader>
          <PlatformPicker
            onSelect={addPlatform}
            onClose={() => setPickerOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
