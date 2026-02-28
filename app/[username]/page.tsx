import { notFound } from "next/navigation"
import { Metadata } from "next"
import { db } from "@/lib/db"
import { getThemeCss, getThemeById, DEFAULT_THEME } from "@/lib/themes"
import { getFontById, DEFAULT_FONT } from "@/lib/fonts"
import ProfileView from "@/components/profile/ProfileView"

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await db.profile.findUnique({
    where: { username },
    select: { name: true, bio: true },
  })

  if (!profile) return { title: "Not found" }

  return {
    title: `${profile.name} (@${username}) — LinkDrop`,
    description: profile.bio ?? `${profile.name}'s link page`,
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params

  const profile = await db.profile.findUnique({
    where: { username },
    include: {
      links: { orderBy: { order: "asc" } },
      blocks: { orderBy: { order: "asc" } },
    },
  })

  if (!profile) notFound()

  // Load theme CSS (server-side, inject inline)
  const themeId = profile.theme ?? DEFAULT_THEME
  const fontId = profile.font ?? DEFAULT_FONT

  const themeCss = getThemeCss(themeId)
  const font = getFontById(fontId)
  const theme = getThemeById(themeId)

  // Strip the @import "tailwindcss" from theme CSS since globals.css handles that
  const inlineThemeCss = themeCss
    .replace(/@import\s+["']tailwindcss["'];?\s*/g, "")
    .replace(/@import\s+["']tw-animate-css["'];?\s*/g, "")
    .replace(/@custom-variant\s+dark[^;]+;?\s*/g, "")

  return (
    <>
      {/* Inject theme CSS */}
      <style id="theme-css" dangerouslySetInnerHTML={{ __html: inlineThemeCss }} />

      {/* Inject font */}
      {font && (
        <link rel="stylesheet" href={font.googleImport} />
      )}

      {/* Override --font-sans with selected font */}
      {font && (
        <style dangerouslySetInnerHTML={{
          __html: `:root { --font-sans: ${font.family}; font-family: ${font.family}; }`
        }} />
      )}

      <ProfileView
        name={profile.name}
        username={profile.username}
        bio={profile.bio}
        links={profile.links}
        blocks={profile.blocks}
      />
    </>
  )
}
