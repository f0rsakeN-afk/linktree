"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import ThemePicker from "@/components/editor/ThemePicker"
import FontPicker from "@/components/editor/FontPicker"
import { FONTS } from "@/lib/fonts"
import { ThemeMeta } from "@/lib/themes"
import { FontDef } from "@/lib/fonts"
import {
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Music,
  Palette,
  Type,
  Link as LinkIcon,
  AlignLeft,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"

// Demo can't import server functions — we'll fetch themes client-side
import { useEffect } from "react"

function IconForPreset({ icon }: { icon?: string | null }) {
  const cls = "w-4 h-4"
  switch (icon) {
    case "twitter": return <Twitter className={cls} />
    case "instagram": return <Instagram className={cls} />
    case "linkedin": return <Linkedin className={cls} />
    case "github": return <Github className={cls} />
    case "youtube": return <Youtube className={cls} />
    case "spotify": return <Music className={cls} />
    default: return <Globe className={cls} />
  }
}

const DEMO_PROFILE = {
  name: "Alex Johnson",
  bio: "Product designer building things in public. I write about design systems and creative code.",
  theme: "minimal",
  font: "inter",
  links: [
    { id: "1", title: "Portfolio", url: "#", icon: "globe", order: 0 },
    { id: "2", title: "Twitter / X", url: "#", icon: "twitter", order: 1 },
    { id: "3", title: "GitHub", url: "#", icon: "github", order: 2 },
    { id: "4", title: "Dribbble", url: "#", icon: "globe", order: 3 },
  ],
  blocks: [
    { id: "1", type: "QUOTE" as const, content: "Great design is invisible until it isn't.", order: 0 },
    { id: "2", type: "TEXT" as const, content: "Currently working on a design system for fintech. Open to freelance projects.", order: 1 },
  ],
}

export default function DemoPage() {
  const [profile, setProfile] = useState(DEMO_PROFILE)
  const [themes, setThemes] = useState<ThemeMeta[]>([])
  const [fonts] = useState<FontDef[]>(FONTS)
  const [activeTab, setActiveTab] = useState("preview")

  useEffect(() => {
    fetch("/api/themes").then(r => r.json()).then(d => setThemes(d.themes ?? []))
  }, [])

  const currentTheme = themes.find(t => t.id === profile.theme)
  const currentFont = fonts.find(f => f.id === profile.font)

  const previewStyle = currentTheme ? {
    "--demo-bg": currentTheme.colors.background,
    "--demo-fg": currentTheme.colors.foreground,
    "--demo-primary": currentTheme.colors.primary,
    "--demo-primary-fg": currentTheme.colors.primaryForeground,
    "--demo-accent": currentTheme.colors.accent,
    "--demo-border": currentTheme.colors.border,
    "--demo-card": currentTheme.colors.card,
    fontFamily: currentTheme.fontSans
      ? `${currentTheme.fontSans}, sans-serif`
      : currentFont?.family ?? "inherit",
  } as React.CSSProperties : {}

  const radius = currentTheme?.radius ?? "0.625rem"
  const shadow = currentTheme?.shadowStyle === "brutal"
    ? `3px 3px 0px ${currentTheme.colors.foreground}`
    : currentTheme?.shadowStyle === "none"
      ? "none"
      : "0 2px 8px rgba(0,0,0,.08)"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="glass border-b border-border/60 px-4 sm:px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary" />
            <span className="font-semibold text-sm">LinkDrop</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 text-xs hidden sm:flex">
              <Sparkles className="w-3 h-3 text-primary" />
              Demo — no account needed
            </Badge>
            <ThemeToggle />
            <Link href="/create">
              <Button size="sm" className="gap-1.5 press">
                Create mine
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-4 py-6 gap-6">
        {/* ── Editor panel ── */}
        <div className="w-full lg:w-96 shrink-0 space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Interactive Playground</h1>
            <p className="text-xs text-muted-foreground">
              Experiment with themes, layouts, and typography. Once you&apos;re satisfied with your design,{" "}
              <Link href="/create" className="text-primary hover:underline">deploy your profile</Link>.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full h-9">
              <TabsTrigger value="profile" className="text-xs gap-1">
                <AlignLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="links" className="text-xs gap-1">
                <LinkIcon className="w-3 h-3" />
                <span className="hidden sm:inline">Links</span>
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-xs gap-1">
                <Palette className="w-3 h-3" />
                <span className="hidden sm:inline">Theme</span>
              </TabsTrigger>
              <TabsTrigger value="font" className="text-xs gap-1">
                <Type className="w-3 h-3" />
                <span className="hidden sm:inline">Font</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-3 mt-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <Input
                  value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="h-9 text-sm"
                  maxLength={50}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Bio</Label>
                <Textarea
                  value={profile.bio}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="text-sm resize-none"
                  maxLength={160}
                />
              </div>
            </TabsContent>

            <TabsContent value="links" className="mt-3">
              <ScrollArea className="h-[280px]">
                <div className="space-y-2 pr-2">
                  {profile.links.map((link, i) => (
                    <div key={link.id} className="rounded-xl border border-border bg-card p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <IconForPreset icon={link.icon} />
                        <Input
                          value={link.title}
                          onChange={e => setProfile(p => ({
                            ...p,
                            links: p.links.map((l, j) => j === i ? { ...l, title: e.target.value } : l)
                          }))}
                          className="h-7 text-xs border-0 shadow-none bg-transparent p-0 focus-visible:ring-0 font-medium"
                          placeholder="Link title"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="theme" className="mt-3">
              <ScrollArea className="h-[320px]">
                {themes.length > 0 ? (
                  <ThemePicker
                    themes={themes}
                    current={profile.theme}
                    onSelect={theme => setProfile(p => ({ ...p, theme }))}
                  />
                ) : (
                  <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                    Loading themes…
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="font" className="mt-3">
              <ScrollArea className="h-[320px]">
                <FontPicker
                  fonts={fonts}
                  current={profile.font}
                  onSelect={font => setProfile(p => ({ ...p, font }))}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <p className="text-sm font-medium">Ready for production?</p>
            <p className="text-xs text-muted-foreground">
              Deploy your customized profile to the edge in seconds. Completely stateless, no account required.
            </p>
            <Link href="/create" className="block">
              <Button className="w-full gap-2 press">
                Deploy now
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Live preview ── */}
        <div className="flex-1 flex flex-col items-center justify-start pt-4">
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Production Preview</p>
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Phone frame */}
            <div
              className="rounded-3xl border-2 overflow-hidden shadow-2xl"
              style={{
                borderColor: currentTheme?.colors.border ?? "var(--border)",
                background: currentTheme?.colors.background ?? "var(--background)",
                ...previewStyle,
              }}
            >
              {/* Status bar */}
              <div
                className="h-8 flex items-center justify-between px-4 text-[10px] opacity-40"
                style={{ color: currentTheme?.colors.foreground ?? "var(--foreground)" }}
              >
                <span>9:41</span>
                <span>⚡ 100%</span>
              </div>

              {/* Profile content */}
              <div className="px-5 pb-8 space-y-4">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2.5 pt-2">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{
                      background: currentTheme?.colors.primary ?? "var(--primary)",
                      color: currentTheme?.colors.primaryForeground ?? "var(--primary-foreground)",
                    }}
                  >
                    {profile.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm" style={{ color: currentTheme?.colors.foreground }}>
                      {profile.name || "Your Name"}
                    </p>
                    <p className="text-[11px] opacity-50" style={{ color: currentTheme?.colors.foreground }}>
                      @demo
                    </p>
                  </div>
                  {profile.bio && (
                    <p className="text-[11px] text-center leading-relaxed max-w-[200px] opacity-60"
                      style={{ color: currentTheme?.colors.foreground }}>
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-2">
                  {profile.links.map(link => (
                    <div
                      key={link.id}
                      className="flex items-center gap-2.5 px-4 py-2.5 cursor-default"
                      style={{
                        background: currentTheme?.colors.primary ?? "var(--primary)",
                        color: currentTheme?.colors.primaryForeground ?? "var(--primary-foreground)",
                        borderRadius: `calc(${radius} * 0.85)`,
                        boxShadow: shadow,
                      }}
                    >
                      <span className="opacity-75 shrink-0">
                        <IconForPreset icon={link.icon} />
                      </span>
                      <span className="text-xs font-medium flex-1 text-center">{link.title}</span>
                    </div>
                  ))}
                </div>

                {/* Blocks */}
                {profile.blocks.map(block => {
                  if (block.type === "QUOTE") {
                    return (
                      <blockquote
                        key={block.id}
                        className="border-l-2 pl-3 py-1 text-[11px] italic opacity-70 leading-relaxed"
                        style={{
                          borderLeftColor: currentTheme?.colors.primary,
                          color: currentTheme?.colors.foreground,
                        }}
                      >
                        &ldquo;{block.content}&rdquo;
                      </blockquote>
                    )
                  }
                  if (block.type === "TEXT") {
                    return (
                      <p key={block.id} className="text-[11px] opacity-60 leading-relaxed"
                        style={{ color: currentTheme?.colors.foreground }}>
                        {block.content}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4 opacity-70">
              Interactive preview rendered in real-time
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
