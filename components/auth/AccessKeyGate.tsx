"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, KeyRound, ArrowRight } from "lucide-react"

interface Props {
  initialUsername?: string
  onAuthenticated: (username: string, accessKey: string, name: string) => void
}

export default function AccessKeyGate({ initialUsername = "", onAuthenticated }: Props) {
  const [username, setUsername] = useState(initialUsername)
  const [accessKey, setAccessKey] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !accessKey.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), accessKey: accessKey.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Invalid credentials")
      }

      const data = await res.json()
      onAuthenticated(username.trim(), accessKey.trim(), data.name)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
          <KeyRound className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit your page</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Enter your username and access key to continue.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-username"
            className="h-11 font-mono"
            autoComplete="username"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="accessKey">Access Key</Label>
          <Input
            id="accessKey"
            type="password"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
            className="h-11 font-mono text-sm"
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          disabled={!username.trim() || !accessKey.trim() || loading}
          className="w-full h-11 text-base gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Unlock editor
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-border space-y-3">
        <p className="text-xs text-center text-muted-foreground">
          Lost your access key?
        </p>
        <Link
          href="/backup"
          className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Lost your key? Use backup key
        </Link>
      </div>
    </div>
  )
}
