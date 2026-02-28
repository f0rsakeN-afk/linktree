import {
  Globe, Instagram, Linkedin, Github, Youtube, Mail, MessageCircle,
  Send, Phone, Music, Music2, BookOpen, BookMarked, Tv, Code2,
  ShoppingBag, Calendar, Coffee, Link, Lock, FileText,
} from "lucide-react"
import { Platform } from "@/lib/platforms"

const LUCIDE: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Instagram, Linkedin, Github, Youtube, Mail, MessageCircle,
  Send, Phone, Music, Music2, BookOpen, BookMarked, Tv, Code2,
  ShoppingBag, Calendar, Coffee, Link, Lock, FileText,
}

interface Props {
  platform: Platform
  className?: string
  size?: number
}

export default function PlatformIcon({ platform, className = "w-4 h-4", size }: Props) {
  if (platform.iconType === "lucide") {
    const Icon = LUCIDE[platform.iconName]
    if (Icon) return <Icon className={className} />
  }

  // Text abbreviation fallback
  return (
    <span
      className="font-bold leading-none select-none"
      style={{ fontSize: size ? size * 0.55 : "0.6rem", letterSpacing: "-0.03em" }}
    >
      {platform.iconName}
    </span>
  )
}
