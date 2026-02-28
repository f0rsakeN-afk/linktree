"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, RefreshCw, ShieldAlert } from "lucide-react"
import CodeReveal from "@/components/auth/CodeReveal"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface NewCodes {
  username: string
  name: string
  accessKey: string
  backupCode: string
}

export default function BackupPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [backupCode, setBackupCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [newCodes, setNewCodes] = useState<NewCodes | null>(null)

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !backupCode.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), backupCode: backupCode.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Recovery failed")
      }

      const data = await res.json()
      setNewCodes({ ...data, username: username.trim() })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Recovery failed")
    } finally {
      setLoading(false)
    }
  }

  if (newCodes) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b border-border px-6 h-14 flex items-center max-w-screen-sm mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary" />
            <span className="font-semibold tracking-tight text-sm">LinkDrop</span>
          </Link>
        </nav>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Your old access key has been invalidated. Save these new keys immediately.
              </p>
            </div>
            <CodeReveal
              profile={newCodes}
              onContinue={() => router.push(`/edit?u=${newCodes.username}`)}
            />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border px-6 h-14 flex items-center justify-between max-w-screen-sm mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-primary" />
          <span className="font-semibold tracking-tight text-sm">LinkDrop</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 mb-4">
              <ShieldAlert className="w-7 h-7 text-amber-500" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Recover access</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Use your backup code to generate a new access key. This will invalidate your old one.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-6 text-sm text-amber-700 dark:text-amber-400">
            <strong className="font-medium">Important:</strong> After recovery, your old access key
            is permanently invalidated. You&apos;ll receive a fresh access key and a new backup code.
          </div>

          <form onSubmit={handleRecover} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                className="h-11 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="backup">Backup code</Label>
              <Input
                id="backup"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value)}
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                className="h-11 font-mono text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={!username.trim() || !backupCode.trim() || loading}
              className="w-full h-11 text-base gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Recover access
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Remember your key?{" "}
            <Link href="/edit" className="text-foreground underline underline-offset-2">
              Sign in normally
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
