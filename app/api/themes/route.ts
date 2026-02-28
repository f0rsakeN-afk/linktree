import { NextResponse } from "next/server"
import { getThemeRegistry } from "@/lib/themes"

export async function GET() {
  const themes = getThemeRegistry()
  return NextResponse.json(
    { themes },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  )
}
