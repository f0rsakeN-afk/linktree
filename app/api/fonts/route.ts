import { NextResponse } from "next/server"
import { FONTS } from "@/lib/fonts"

export async function GET() {
  return NextResponse.json(
    { fonts: FONTS },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  )
}
