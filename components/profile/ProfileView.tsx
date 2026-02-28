"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { getPlatformById } from "@/lib/platforms"
import PlatformIcon from "@/components/PlatformIcon"
import { ExternalLink } from "lucide-react"

interface LinkItem {
  id: string
  title: string
  url: string
  icon?: string | null
  order: number
}

interface BlockItem {
  id: string
  type: "TEXT" | "HEADING" | "QUOTE" | "DIVIDER"
  content: string
  order: number
}

interface Props {
  name: string
  username: string
  bio?: string | null
  links: LinkItem[]
  blocks: BlockItem[]
}

function ProfileLink({ link, index }: { link: LinkItem; index: number }) {
  const platform = link.icon ? getPlatformById(link.icon) : undefined

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className="group flex items-center gap-4 w-full px-5 py-4 rounded-[var(--radius-lg,0.75rem)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] hover:border-[var(--primary)] transition-all duration-200 cursor-pointer"
      style={{ boxShadow: "var(--shadow-sm, 0 1px 3px rgba(0,0,0,.06))" }}
    >
      {/* Platform icon bubble */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
        style={{
          background: platform?.color ? `${platform.color}18` : "var(--muted)",
          color: platform?.color ?? "var(--muted-foreground)",
        }}
      >
        {platform
          ? <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
          : <ExternalLink className="w-3.5 h-3.5" />
        }
      </div>

      <span className="flex-1 text-sm font-medium text-center">{link.title}</span>

      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
    </motion.a>
  )
}

function ContentBlock({ block, index }: { block: BlockItem; index: number }) {
  const delay = 0.3 + index * 0.05

  switch (block.type) {
    case "HEADING":
      return (
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay }}
          className="text-lg font-semibold tracking-tight text-[var(--foreground)] mt-5 mb-1"
        >
          {block.content}
        </motion.h2>
      )
    case "TEXT":
      return (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay }}
          className="text-sm text-[var(--muted-foreground)] leading-relaxed"
        >
          {block.content}
        </motion.p>
      )
    case "QUOTE":
      return (
        <motion.blockquote
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay }}
          className="border-l-2 border-[var(--primary)] pl-4 py-2 my-3 text-sm italic text-[var(--muted-foreground)] leading-relaxed"
        >
          {block.content}
        </motion.blockquote>
      )
    case "DIVIDER":
      return (
        <motion.hr
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay }}
          className="border-[var(--border)] my-4 origin-left"
        />
      )
    default:
      return null
  }
}

export default function ProfileView({ name, username, bio, links, blocks }: Props) {
  const initials = name
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-16 sm:py-20"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="w-full max-w-[360px] space-y-7">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col items-center text-center gap-3"
        >
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold select-none"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {initials}
          </div>

          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
              {name}
            </h1>
            <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
              @{username}
            </p>
          </div>

          {bio && (
            <p
              className="text-sm leading-relaxed max-w-[280px]"
              style={{ color: "var(--muted-foreground)" }}
            >
              {bio}
            </p>
          )}
        </motion.div>

        {/* ── Links ── */}
        {links.length > 0 && (
          <div className="space-y-2.5">
            {links.map((link, i) => (
              <ProfileLink key={link.id} link={link} index={i} />
            ))}
          </div>
        )}

        {/* ── Content blocks ── */}
        {blocks.length > 0 && (
          <div className="space-y-1.5">
            {blocks.map((block, i) => (
              <ContentBlock key={block.id} block={block} index={i} />
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="pt-6 flex justify-center"
        >
          <Link
            href="/"
            className="text-xs transition-opacity hover:opacity-60"
            style={{ color: "var(--muted-foreground)", opacity: 0.35 }}
          >
            Made with LinkDrop
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
