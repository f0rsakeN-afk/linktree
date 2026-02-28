"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ThemePicker from "./ThemePicker"
import FontPicker from "./FontPicker"
import LinkEditor from "./LinkEditor"
import BlockEditor from "./BlockEditor"
import { ThemeMeta } from "@/lib/themes"
import { FontDef } from "@/lib/fonts"
import { ProfileData } from "@/lib/types"
import {
  Save,
  Loader2,
  ExternalLink,
  Palette,
  Type,
  Link as LinkIcon,
  AlignLeft,
  Copy,
  Check,
} from "lucide-react"

interface Props {
  username: string
  accessKey: string
  initialProfile: ProfileData
  themes: ThemeMeta[]
  fonts: FontDef[]
  baseUrl: string
}

export default function ProfileEditor({
  username,
  accessKey,
  initialProfile,
  themes,
  fonts,
  baseUrl,
}: Props) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [fontOpen, setFontOpen] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)

  const profileUrl = `${baseUrl}/${username}`
  const currentTheme = themes.find((t) => t.id === profile.theme)
  const currentFont = fonts.find((f) => f.id === profile.font)

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setProfile((p) => ({ ...p, [key]: value }))
    setDirty(true)
  }

  const save = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/profile/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-key": accessKey,
        },
        body: JSON.stringify(profile),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Save failed")
      }

      setDirty(false)
      toast.success("Profile saved")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }, [username, accessKey, profile])

  // Auto-save on Ctrl+S / Cmd+S
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        if (dirty) save()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [dirty, save])

  async function copyUrl() {
    await navigator.clipboard.writeText(profileUrl)
    setUrlCopied(true)
    toast.success("Profile URL copied!")
    setTimeout(() => setUrlCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium truncate">
              Editing <span className="font-mono text-muted-foreground">@{username}</span>
            </span>
            {dirty && (
              <Badge variant="secondary" className="text-xs shrink-0">
                Unsaved
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Preview
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Button
              onClick={save}
              disabled={!dirty || saving}
              size="sm"
              className="gap-1.5"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Profile URL card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium">Your profile is live</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
            <span className="flex-1 font-mono text-sm truncate text-muted-foreground">
              {profileUrl}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={copyUrl}>
                {urlCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full h-10">
            <TabsTrigger value="links" className="gap-1.5 text-xs sm:text-sm">
              <LinkIcon className="w-3.5 h-3.5" />
              Links
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-1.5 text-xs sm:text-sm">
              <AlignLeft className="w-3.5 h-3.5" />
              Content
            </TabsTrigger>
            <TabsTrigger value="design" className="gap-1.5 text-xs sm:text-sm">
              <Palette className="w-3.5 h-3.5" />
              Design
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
              <Type className="w-3.5 h-3.5" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Links tab */}
          <TabsContent value="links" className="space-y-4">
            <LinkEditor
              links={profile.links}
              onChange={(links) => update("links", links)}
            />
          </TabsContent>

          {/* Content blocks tab */}
          <TabsContent value="content" className="space-y-4">
            <BlockEditor
              blocks={profile.blocks}
              onChange={(blocks) => update("blocks", blocks)}
            />
          </TabsContent>

          {/* Design tab */}
          <TabsContent value="design" className="space-y-6">
            {/* Theme */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Theme</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Colors, shadows, and border radius
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {currentTheme?.label ?? profile.theme}
                </Badge>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setThemeOpen(true)}
              >
                <div
                  className="w-4 h-4 rounded-full border border-border shrink-0"
                  style={{ background: currentTheme?.colors.primary ?? "var(--primary)" }}
                />
                Change theme
                <Palette className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </Button>
            </div>

            <Separator />

            {/* Font */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Font</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Typography across your profile
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {currentFont?.label ?? profile.font}
                </Badge>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setFontOpen(true)}
              >
                <span className="flex-1 text-left" style={{ fontFamily: currentFont?.family }}>
                  {currentFont?.label ?? "Change font"}
                </span>
                <Type className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </Button>
            </div>

            {/* Live preview hint */}
            <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground text-center">
              Save changes and visit your{" "}
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2">
                profile page
              </a>{" "}
              to see the full design live.
            </div>
          </TabsContent>

          {/* Profile tab */}
          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                maxLength={50}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio ?? ""}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="A short bio or tagline…"
                maxLength={160}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {(profile.bio ?? "").length}/160
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Theme picker dialog */}
      <Dialog open={themeOpen} onOpenChange={setThemeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a theme</DialogTitle>
          </DialogHeader>
          <ThemePicker
            themes={themes}
            current={profile.theme}
            onSelect={(id) => {
              update("theme", id)
              setThemeOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Font picker dialog */}
      <Dialog open={fontOpen} onOpenChange={setFontOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose a font</DialogTitle>
          </DialogHeader>
          <FontPicker
            fonts={fonts}
            current={profile.font}
            onSelect={(id) => {
              update("font", id)
              setFontOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
