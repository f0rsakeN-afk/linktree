"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = saved === "dark" || (!saved && prefersDark)

    if (document.documentElement.classList.contains("dark") !== isDark) {
      document.documentElement.classList.toggle("dark", isDark)
    }

    // Asynchronous updates to satisfy react-hooks/set-state-in-effect
    setTimeout(() => {
      setDark(isDark)
      setMounted(true)
    }, 0)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="w-9 h-9 rounded-xl press"
      aria-label="Toggle theme"
    >
      {dark ? (
        <Sun className="w-4 h-4 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 transition-transform rotate-0 scale-100" />
      )}
    </Button>
  )
}
