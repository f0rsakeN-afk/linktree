import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import {
  generateAccessKey,
  generateBackupCode,
  hashSecret,
  verifySecret,
} from "@/lib/crypto"

const BackupSchema = z.object({
  username: z.string().min(1),
  backupCode: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, backupCode } = BackupSchema.parse(body)

    const profile = await db.profile.findUnique({
      where: { username },
      select: { id: true, name: true, backupHash: true },
    })

    if (!profile) {
      await verifySecret(backupCode, "$2a$12$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await verifySecret(backupCode, profile.backupHash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate fresh access key + new backup code, invalidating the old pair
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

    // Return new codes once — never stored in DB
    return NextResponse.json({
      accessKey: rawAccessKey,
      backupCode: rawBackupCode,
      name: profile.name,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    console.error("POST /api/backup", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
