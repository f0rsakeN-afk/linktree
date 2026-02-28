"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Download,
} from "lucide-react"

interface Props {
  profile: {
    username: string
    name: string
    accessKey: string
    backupCode: string
  }
  onContinue: () => void
}

function CopyField({
  label,
  value,
  description,
  mono = true,
}: {
  label: string
  value: string
  description: string
  mono?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    toast.success(`${label} copied`)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayValue = visible ? value : value.replace(/[^-]/g, "•")

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setVisible(!visible)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label={visible ? "Hide" : "Show"}
          >
            {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={copy}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Copy"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
      <div
        className={`text-sm tracking-widest break-all select-all cursor-text px-3 py-2 rounded-lg bg-muted ${mono ? "font-mono" : ""}`}
      >
        {displayValue}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function downloadTxt(profile: Props["profile"]) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/${profile.username}`
  const text = [
    `LinkDrop — Profile Keys`,
    `Generated: ${new Date().toISOString()}`,
    ``,
    `Profile URL:  ${url}`,
    `Username:     @${profile.username}`,
    `Display Name: ${profile.name}`,
    ``,
    `─────────────────────────────────────────────`,
    `ACCESS KEY (use to edit your profile)`,
    profile.accessKey,
    ``,
    `BACKUP CODE (use to regenerate your access key)`,
    profile.backupCode,
    `─────────────────────────────────────────────`,
    ``,
    `⚠  Store this file somewhere safe.`,
    `   These keys cannot be recovered if lost.`,
    `   Delete this file from any cloud storage.`,
  ].join("\n")

  const blob = new Blob([text], { type: "text/plain" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = `linkdrop-${profile.username}-keys.txt`
  a.click()
  URL.revokeObjectURL(a.href)
  toast.success("Keys downloaded as .txt")
}

export default function CodeReveal({ profile, onContinue }: Props) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 mb-4">
          <ShieldCheck className="w-7 h-7 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Save your keys</h2>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Hi {profile.name}! Your profile{" "}
          <span className="font-mono text-foreground">@{profile.username}</span> is ready.
        </p>
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <p className="font-medium">These are shown exactly once</p>
          <p className="text-xs opacity-80">
            We never store your keys. Copy them both somewhere safe before continuing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="gap-2"
          onClick={async () => {
            const url = `${window.location.origin}/${profile.username}`
            const text = `Access Key: ${profile.accessKey}\nBackup Code: ${profile.backupCode}\nProfile URL: ${url}`
            await navigator.clipboard.writeText(text)
            toast.success("All keys copied to clipboard")
          }}
        >
          <Copy className="w-4 h-4" />
          Copy all
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => downloadTxt(profile)}
        >
          <Download className="w-4 h-4" />
          Download .txt
        </Button>
      </div>

      <div className="space-y-3">
        <CopyField
          label="Access Key"
          value={profile.accessKey}
          description="Use this to edit your profile. Keep it secret. Store it in a password manager."
        />
        <CopyField
          label="Backup Code"
          value={profile.backupCode}
          description="Use this to generate a new access key if you lose it. Store it separately from your access key."
        />
      </div>

      <div className="rounded-xl border border-border p-4 space-y-3">
        <p className="text-sm font-medium">Your profile details</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Display name</div>
          <div className="font-medium">{profile.name}</div>
          <div className="text-muted-foreground">Username</div>
          <div className="font-mono font-medium">@{profile.username}</div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl border border-border cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            confirmed ? "bg-primary border-primary" : "border-border"
          }`}
        >
          {confirmed && <Check className="w-3 h-3 text-primary-foreground" />}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          I have saved my <strong className="text-foreground">access key</strong> and{" "}
          <strong className="text-foreground">backup code</strong> in a safe place. I understand
          they cannot be recovered.
        </p>
      </div>

      <Button
        onClick={onContinue}
        disabled={!confirmed}
        className="w-full h-11 text-base gap-2"
      >
        Continue to editor
        <ArrowRight className="w-4 h-4" />
      </Button>

      <div className="flex justify-center">
        <Badge variant="secondary" className="text-xs gap-1.5">
          <ShieldCheck className="w-3 h-3" />
          End-to-end secured · Keys never leave your browser after this
        </Badge>
      </div>
    </div>
  )
}
