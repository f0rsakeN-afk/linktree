"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Quote, Heading2, AlignLeft, Minus, ChevronUp, ChevronDown } from "lucide-react"

import { BlockItem } from "@/lib/types"
type BlockType = BlockItem["type"]

interface Props {
  blocks: BlockItem[]
  onChange: (blocks: BlockItem[]) => void
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    type: "TEXT",
    label: "Text",
    icon: <AlignLeft className="w-3.5 h-3.5" />,
    description: "A paragraph of text",
  },
  {
    type: "HEADING",
    label: "Heading",
    icon: <Heading2 className="w-3.5 h-3.5" />,
    description: "A bold section header",
  },
  {
    type: "QUOTE",
    label: "Quote",
    icon: <Quote className="w-3.5 h-3.5" />,
    description: "A styled blockquote",
  },
  {
    type: "DIVIDER",
    label: "Divider",
    icon: <Minus className="w-3.5 h-3.5" />,
    description: "A horizontal separator",
  },
]

function blockPlaceholder(type: BlockType) {
  switch (type) {
    case "TEXT": return "Write something about yourself…"
    case "HEADING": return "Section title"
    case "QUOTE": return "\"An inspiring quote or thought…\""
    case "DIVIDER": return "(divider — no content needed)"
  }
}

function BlockIcon({ type }: { type: BlockType }) {
  switch (type) {
    case "HEADING": return <Heading2 className="w-3.5 h-3.5" />
    case "QUOTE": return <Quote className="w-3.5 h-3.5" />
    case "DIVIDER": return <Minus className="w-3.5 h-3.5" />
    default: return <AlignLeft className="w-3.5 h-3.5" />
  }
}

function BlockRow({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  block: BlockItem
  onUpdate: (b: BlockItem) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1.5 text-muted-foreground flex-1">
          <BlockIcon type={block.type} />
          <span className="text-xs font-medium capitalize">{block.type.toLowerCase()}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={onMoveUp} disabled={isFirst} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {block.type !== "DIVIDER" ? (
        <div className="p-3">
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ ...block, content: e.target.value })}
            placeholder={blockPlaceholder(block.type)}
            rows={block.type === "HEADING" ? 1 : 3}
            maxLength={500}
            className={`resize-none border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent text-sm ${block.type === "HEADING" ? "font-semibold text-base" : ""
              } ${block.type === "QUOTE" ? "italic text-muted-foreground" : ""}`}
          />
        </div>
      ) : (
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">divider</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}
    </div>
  )
}

export default function BlockEditor({ blocks, onChange }: Props) {
  const [showTypeMenu, setShowTypeMenu] = useState(false)

  function addBlock(type: BlockType) {
    onChange([...blocks, { type, content: "", order: blocks.length }])
    setShowTypeMenu(false)
  }

  function updateBlock(index: number, updated: BlockItem) {
    const next = [...blocks]
    next[index] = updated
    onChange(next)
  }

  function deleteBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, order: i })))
  }

  function move(index: number, dir: "up" | "down") {
    const next = [...blocks]
    const swap = dir === "up" ? index - 1 : index + 1
      ;[next[index], next[swap]] = [next[swap], next[index]]
    onChange(next.map((b, i) => ({ ...b, order: i })))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Content blocks</h3>
          <p className="text-xs text-muted-foreground">Text, headings, quotes, and dividers</p>
        </div>
        <Badge variant="secondary" className="text-xs">{blocks.length}</Badge>
      </div>

      <div className="space-y-2">
        {blocks.map((block, i) => (
          <BlockRow
            key={block.id ?? i}
            block={block}
            onUpdate={(u) => updateBlock(i, u)}
            onDelete={() => deleteBlock(i)}
            onMoveUp={() => move(i, "up")}
            onMoveDown={() => move(i, "down")}
            isFirst={i === 0}
            isLast={i === blocks.length - 1}
          />
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-10 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
          No content blocks yet. Add headings, text, or quotes below.
        </div>
      )}

      {/* Add block */}
      <div className="relative">
        <Button
          variant="outline"
          className="w-full gap-2 border-dashed"
          onClick={() => setShowTypeMenu(!showTypeMenu)}
        >
          <Plus className="w-4 h-4" />
          Add content block
        </Button>

        {showTypeMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-border bg-popover shadow-lg overflow-hidden z-10">
            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                onClick={() => addBlock(bt.type)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors text-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                  {bt.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{bt.label}</p>
                  <p className="text-xs text-muted-foreground">{bt.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
