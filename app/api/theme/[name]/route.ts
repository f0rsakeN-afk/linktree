import { NextRequest, NextResponse } from "next/server"
import { getThemeCss, getThemeRegistry } from "@/lib/themes"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

  // Validate theme name against registry to prevent path traversal
  const registry = getThemeRegistry()
  const theme = registry.find((t) => t.id === name)
  if (!theme) {
    return NextResponse.json({ error: "Theme not found" }, { status: 404 })
  }

  const css = getThemeCss(name)
  return new NextResponse(css, {
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
