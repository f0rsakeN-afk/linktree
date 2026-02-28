import { createHmac, randomBytes } from "crypto"
import { hash, compare } from "bcryptjs"

/** ─── Constants ─────────────────────────────────────────────────────────── */

const BCRYPT_ROUNDS = 12

const BASE62 =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

const BASE36_UPPER = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

/** ─── Private helpers ────────────────────────────────────────────────────── */

function requireSecret(): string {
  const s = process.env.HMAC_SECRET
  if (!s || s.length < 32) {
    throw new Error("HMAC_SECRET env var is missing or too short (min 32 chars)")
  }
  return s
}

function hmacSha256(data: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(data).digest()
}

function encodeBase(buf: Buffer, alphabet: string): string {
  const base = BigInt(alphabet.length)
  let n = BigInt("0x" + buf.toString("hex"))
  const chars: string[] = []
  while (n > 0n) {
    chars.unshift(alphabet[Number(n % base)])
    n /= base
  }
  return chars.join("") || alphabet[0]
}

function groupChars(s: string, size: number): string {
  return s.match(new RegExp(`.{1,${size}}`, "g"))?.join("-") ?? s
}

/** ─── Access Key ─────────────────────────────────────────────────────────── */
// 40 base-62 characters (≈238 bits of HMAC-SHA256 entropy)
// Formatted as: XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX
// Derived from: HMAC(nonce || profileId || timestamp, HMAC_SECRET)

export function generateAccessKey(profileId: string): string {
  const secret = requireSecret()
  const nonce = randomBytes(32).toString("hex")
  const data = `${nonce}:${profileId}:${Date.now()}`
  const buf = hmacSha256(data, secret)
  const raw = encodeBase(buf, BASE62).padStart(40, "0").slice(0, 40)
  return groupChars(raw, 8)
}

/** ─── Backup Code ─────────────────────────────────────────────────────────
 * 25 uppercase alphanumeric characters (≈130 bits of entropy)
 * Formatted as: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
 * Derived from: HMAC(nonce || timestamp || "backup", HMAC_SECRET)
 * NOTE: domain-separated from access keys with the "backup" suffix.
 */
export function generateBackupCode(): string {
  const secret = requireSecret()
  const nonce = randomBytes(32).toString("hex")
  const data = `${nonce}:${Date.now()}:backup`
  const buf = hmacSha256(data, secret)
  const raw = encodeBase(buf, BASE36_UPPER).padStart(25, "0").slice(0, 25)
  return groupChars(raw, 5)
}

/** ─── Hashing & Verification ────────────────────────────────────────────── */

export async function hashSecret(secret: string): Promise<string> {
  return hash(secret, BCRYPT_ROUNDS)
}

export async function verifySecret(
  plain: string,
  hashed: string
): Promise<boolean> {
  return compare(plain, hashed)
}

/** ─── Username generation ───────────────────────────────────────────────── */

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20)
    || "user"
}

export function generateUsername(name: string): string {
  const base = slugifyName(name)
  const suffix = randomBytes(2).toString("hex") // 4 hex chars
  return `${base}${suffix}`
}
