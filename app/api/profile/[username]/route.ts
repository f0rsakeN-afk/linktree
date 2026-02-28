import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { verifySecret } from "@/lib/crypto"

const LinkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(100),
  url: z.string().url(),
  icon: z.string().optional(),
  order: z.number().int(),
})

const BlockSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["TEXT", "HEADING", "QUOTE", "DIVIDER"]),
  content: z.string().max(500),
  order: z.number().int(),
})

const UpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  bio: z.string().max(160).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  theme: z.string().optional(),
  font: z.string().optional(),
  links: z.array(LinkSchema).optional(),
  blocks: z.array(BlockSchema).optional(),
})

async function authenticate(
  req: NextRequest,
  username: string
): Promise<{ ok: false; res: NextResponse } | { ok: true; profileId: string }> {
  const accessKey = req.headers.get("x-access-key")
  if (!accessKey) {
    return { ok: false, res: NextResponse.json({ error: "Missing access key" }, { status: 401 }) }
  }

  const profile = await db.profile.findUnique({
    where: { username },
    select: { id: true, accessKeyHash: true },
  })

  if (!profile) {
    return { ok: false, res: NextResponse.json({ error: "Profile not found" }, { status: 404 }) }
  }

  const valid = await verifySecret(accessKey, profile.accessKeyHash)
  if (!valid) {
    return { ok: false, res: NextResponse.json({ error: "Invalid access key" }, { status: 401 }) }
  }

  return { ok: true, profileId: profile.id }
}

// GET /api/profile/[username] — public
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const profile = await db.profile.findUnique({
    where: { username },
    include: {
      links: { orderBy: { order: "asc" } },
      blocks: { orderBy: { order: "asc" } },
    },
  })

  if (!profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { accessKeyHash: _a, backupHash: _b, ...safe } = profile
  return NextResponse.json(safe)
}

// PUT /api/profile/[username] — authenticated
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const auth = await authenticate(req, username)
  if (!auth.ok) return auth.res

  try {
    const body = await req.json()
    const data = UpdateSchema.parse(body)

    // Update base profile fields
    await db.profile.update({
      where: { id: auth.profileId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.theme !== undefined && { theme: data.theme }),
        ...(data.font !== undefined && { font: data.font }),
      },
    })

    // Replace links
    if (data.links !== undefined) {
      await db.link.deleteMany({ where: { profileId: auth.profileId } })
      if (data.links.length > 0) {
        await db.link.createMany({
          data: data.links.map(({ id: _id, ...l }) => ({
            ...l,
            profileId: auth.profileId,
          })),
        })
      }
    }

    // Replace blocks
    if (data.blocks !== undefined) {
      await db.block.deleteMany({ where: { profileId: auth.profileId } })
      if (data.blocks.length > 0) {
        await db.block.createMany({
          data: data.blocks.map(({ id: _id, ...b }) => ({
            ...b,
            profileId: auth.profileId,
          })),
        })
      }
    }

    const updated = await db.profile.findUnique({
      where: { id: auth.profileId },
      include: {
        links: { orderBy: { order: "asc" } },
        blocks: { orderBy: { order: "asc" } },
      },
    })

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const { accessKeyHash: _a, backupHash: _b, ...safe } = updated
    return NextResponse.json(safe)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", issues: err.issues }, { status: 400 })
    }
    console.error("PUT /api/profile/[username]", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/profile/[username] — authenticated
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const auth = await authenticate(req, username)
  if (!auth.ok) return auth.res

  await db.profile.delete({ where: { id: auth.profileId } })
  return NextResponse.json({ deleted: true })
}
