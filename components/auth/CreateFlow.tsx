"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CodeReveal from "./CodeReveal"
import { Loader2, ArrowRight } from "lucide-react"

interface CreatedProfile {
  username: string
  name: string
  accessKey: string
  backupCode: string
}

export default function CreateFlow() {
  const router = useRouter()
  const [step, setStep] = useState<"name" | "reveal">("name")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<CreatedProfile | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to create profile")
      }
      const data = await res.json()
      setProfile(data)
      setStep("reveal")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (step === "reveal" && profile) {
    return (
      <motion.div key="reveal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <CodeReveal
          profile={profile}
          onContinue={() => router.push(`/edit?u=${profile.username}`)}
        />
      </motion.div>
    )
  }

  return (
    <motion.div key="name" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="w-full max-w-sm mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Create your page</h1>
          <p className="text-sm text-muted-foreground">
            Just your name. No email, no password — a secure key handles everything.
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Your name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="h-11 text-base"
              maxLength={50}
              autoFocus
              autoComplete="name"
            />
          </div>

          <Button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full h-11 gap-2 press"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <><span>Create my page</span><ArrowRight className="w-4 h-4" /></>
            }
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          Already have a page?{" "}
          <Link href="/edit" className="text-foreground underline underline-offset-2">
            Sign in with your access key
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
