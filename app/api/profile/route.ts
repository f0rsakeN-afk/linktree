import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import {
  generateAccessKey,
  generateBackupCode,
  generateUsername,
  hashSecret,
} from "@/lib/crypto"
import { DEFAULT_THEME } from "@/lib/themes"
import { DEFAULT_FONT } from "@/lib/fonts"

const CreateSchema = z.object({
  name: z.string().min(1).max(50).trim(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name } = CreateSchema.parse(body)

    // Generate a unique username with collision retry
    let username = generateUsername(name)
    let attempts = 0
    while (attempts < 5) {
      const existing = await db.profile.findUnique({ where: { username } })
      if (!existing) break
      username = generateUsername(name)
      attempts++
    }

    // Create the profile first to get an ID
    const profile = await db.profile.create({
      data: {
        name,
        username,
        accessKeyHash: "__pending__",
        backupHash: "__pending__",
        theme: DEFAULT_THEME,
        font: DEFAULT_FONT,
      },
    })

    // Generate secrets using the real profile ID (binds access key to this profile)
    const rawAccessKey = generateAccessKey(profile.id)
    const rawBackupCode = generateBackupCode()

    const [accessKeyHash, backupHash] = await Promise.all([
      hashSecret(rawAccessKey),
      hashSecret(rawBackupCode),
    ])

    await db.profile.update({
      where: { id: profile.id },
      data: { accessKeyHash, backupHash },
    })

    // Return plaintext codes ONCE — never stored in DB
    return NextResponse.json({
      username: profile.username,
      name: profile.name,
      accessKey: rawAccessKey,
      backupCode: rawBackupCode,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    console.error("POST /api/profile", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.toLowerCase()
  if (!q) return NextResponse.json({ profiles: [] })

  const profiles = await db.profile.findMany({
    where: { username: { contains: q } },
    select: { username: true, name: true },
    take: 5,
  })

  return NextResponse.json({ profiles })
}
