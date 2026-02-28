"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import AccessKeyGate from "@/components/auth/AccessKeyGate"
import ProfileEditor from "@/components/editor/ProfileEditor"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface Profile {
  name: string
  bio?: string | null
  theme: string
  font: string
  links: Array<{ id: string; title: string; url: string; icon?: string | null; order: number }>
  blocks: Array<{ id: string; type: "TEXT" | "HEADING" | "QUOTE" | "DIVIDER"; content: string; order: number }>
}

function EditPageInner() {
  const params = useSearchParams()
  const urlUsername = params.get("u") ?? ""

  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState(urlUsername)
  const [accessKey, setAccessKey] = useState("")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [themes, setThemes] = useState<import("@/lib/themes").ThemeMeta[]>([])
  const [fonts, setFonts] = useState<import("@/lib/fonts").FontDef[]>([])
  const [loading, setLoading] = useState(false)
  const [baseUrl, setBaseUrl] = useState("")

  async function handleAuth(u: string, key: string) {
    setLoading(true)
    try {
      const [profileRes, themesRes, fontsRes] = await Promise.all([
        fetch(`/api/profile/${u}`, {
          headers: { "x-access-key": key },
        }),
        fetch("/api/themes"),
        fetch("/api/fonts"),
      ])

      // Note: public GET doesn't need auth, but we verified via /api/verify first
      if (!profileRes.ok) throw new Error("Failed to load profile")

      const [profileData, themesData, fontsData] = await Promise.all([
        profileRes.json(),
        themesRes.json(),
        fontsRes.json(),
      ])

      setUsername(u)
      setAccessKey(key)
      setProfile(profileData)
      setThemes(themesData.themes ?? [])
      setFonts(fontsData.fonts ?? [])
      setBaseUrl(window.location.origin)
      setAuthenticated(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b border-border px-6 h-14 flex items-center justify-between max-w-screen-sm mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary" />
            <span className="font-semibold tracking-tight text-sm">LinkDrop</span>
          </Link>
        </nav>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <AccessKeyGate
            initialUsername={urlUsername}
            onAuthenticated={handleAuth}
          />
        </main>
      </div>
    )
  }

  if (!profile) return null

  return (
    <ProfileEditor
      username={username}
      accessKey={accessKey}
      initialProfile={profile}
      themes={themes}
      fonts={fonts}
      baseUrl={baseUrl}
    />
  )
}

export default function EditPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <EditPageInner />
    </Suspense>
  )
}
