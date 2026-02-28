import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { verifySecret } from "@/lib/crypto"

const VerifySchema = z.object({
  username: z.string().min(1),
  accessKey: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, accessKey } = VerifySchema.parse(body)

    const profile = await db.profile.findUnique({
      where: { username },
      select: { id: true, name: true, accessKeyHash: true },
    })

    if (!profile) {
      // Constant-time-ish: still do a compare to prevent timing-based username enumeration
      await verifySecret(accessKey, "$2a$12$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await verifySecret(accessKey, profile.accessKeyHash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ ok: true, name: profile.name })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    console.error("POST /api/verify", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
