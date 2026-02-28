export interface Platform {
  id: string
  label: string
  placeholder: string
  category: "social" | "professional" | "creative" | "communication" | "content" | "other"
  color: string          // brand accent color for the icon dot
  iconType: "lucide" | "text"
  iconName: string       // lucide icon name OR 2-3 letter abbreviation
}

export const PLATFORMS: Platform[] = [
  // ── Social ──────────────────────────────────────────────────────────────
  {
    id: "twitter",      label: "Twitter / X",     placeholder: "https://x.com/username",
    category: "social", color: "#000", iconType: "text", iconName: "X",
  },
  {
    id: "instagram",    label: "Instagram",        placeholder: "https://instagram.com/username",
    category: "social", color: "#E1306C", iconType: "lucide", iconName: "Instagram",
  },
  {
    id: "tiktok",       label: "TikTok",           placeholder: "https://tiktok.com/@username",
    category: "social", color: "#ff0050", iconType: "text", iconName: "TT",
  },
  {
    id: "threads",      label: "Threads",          placeholder: "https://threads.net/@username",
    category: "social", color: "#000", iconType: "text", iconName: "Th",
  },
  {
    id: "bluesky",      label: "Bluesky",          placeholder: "https://bsky.app/profile/username",
    category: "social", color: "#0085FF", iconType: "text", iconName: "BS",
  },
  {
    id: "mastodon",     label: "Mastodon",         placeholder: "https://mastodon.social/@username",
    category: "social", color: "#6364FF", iconType: "text", iconName: "Ma",
  },
  {
    id: "pinterest",    label: "Pinterest",        placeholder: "https://pinterest.com/username",
    category: "social", color: "#E60023", iconType: "text", iconName: "Pi",
  },
  {
    id: "snapchat",     label: "Snapchat",         placeholder: "https://snapchat.com/add/username",
    category: "social", color: "#FFFC00", iconType: "text", iconName: "Sn",
  },

  // ── Professional ─────────────────────────────────────────────────────────
  {
    id: "linkedin",     label: "LinkedIn",         placeholder: "https://linkedin.com/in/username",
    category: "professional", color: "#0A66C2", iconType: "lucide", iconName: "Linkedin",
  },
  {
    id: "github",       label: "GitHub",           placeholder: "https://github.com/username",
    category: "professional", color: "#24292e", iconType: "lucide", iconName: "Github",
  },
  {
    id: "gitlab",       label: "GitLab",           placeholder: "https://gitlab.com/username",
    category: "professional", color: "#FC6D26", iconType: "text", iconName: "GL",
  },
  {
    id: "website",      label: "Website",          placeholder: "https://yourwebsite.com",
    category: "professional", color: "#6366F1", iconType: "lucide", iconName: "Globe",
  },
  {
    id: "resume",       label: "Resume / CV",      placeholder: "https://read.cv/username",
    category: "professional", color: "#374151", iconType: "lucide", iconName: "FileText",
  },
  {
    id: "producthunt",  label: "Product Hunt",     placeholder: "https://producthunt.com/@username",
    category: "professional", color: "#DA552F", iconType: "text", iconName: "PH",
  },

  // ── Creative ─────────────────────────────────────────────────────────────
  {
    id: "dribbble",     label: "Dribbble",         placeholder: "https://dribbble.com/username",
    category: "creative", color: "#EA4C89", iconType: "text", iconName: "Dr",
  },
  {
    id: "behance",      label: "Behance",          placeholder: "https://behance.net/username",
    category: "creative", color: "#1769FF", iconType: "text", iconName: "Be",
  },
  {
    id: "figma",        label: "Figma",            placeholder: "https://figma.com/@username",
    category: "creative", color: "#F24E1E", iconType: "text", iconName: "Fi",
  },
  {
    id: "codepen",      label: "CodePen",          placeholder: "https://codepen.io/username",
    category: "creative", color: "#000", iconType: "lucide", iconName: "Code2",
  },
  {
    id: "devto",        label: "Dev.to",           placeholder: "https://dev.to/username",
    category: "creative", color: "#0a0a0a", iconType: "text", iconName: "Dev",
  },
  {
    id: "hashnode",     label: "Hashnode",         placeholder: "https://hashnode.com/@username",
    category: "creative", color: "#2962FF", iconType: "text", iconName: "Hn",
  },

  // ── Communication ────────────────────────────────────────────────────────
  {
    id: "email",        label: "Email",            placeholder: "mailto:you@example.com",
    category: "communication", color: "#6366F1", iconType: "lucide", iconName: "Mail",
  },
  {
    id: "discord",      label: "Discord",          placeholder: "https://discord.gg/invite",
    category: "communication", color: "#5865F2", iconType: "lucide", iconName: "MessageCircle",
  },
  {
    id: "telegram",     label: "Telegram",         placeholder: "https://t.me/username",
    category: "communication", color: "#26A5E4", iconType: "lucide", iconName: "Send",
  },
  {
    id: "whatsapp",     label: "WhatsApp",         placeholder: "https://wa.me/phonenumber",
    category: "communication", color: "#25D366", iconType: "lucide", iconName: "Phone",
  },
  {
    id: "signal",       label: "Signal",           placeholder: "https://signal.me/#p/username",
    category: "communication", color: "#3A76F0", iconType: "lucide", iconName: "Lock",
  },

  // ── Content & Media ──────────────────────────────────────────────────────
  {
    id: "youtube",      label: "YouTube",          placeholder: "https://youtube.com/@username",
    category: "content", color: "#FF0000", iconType: "lucide", iconName: "Youtube",
  },
  {
    id: "twitch",       label: "Twitch",           placeholder: "https://twitch.tv/username",
    category: "content", color: "#9146FF", iconType: "lucide", iconName: "Tv",
  },
  {
    id: "spotify",      label: "Spotify",          placeholder: "https://open.spotify.com/artist/...",
    category: "content", color: "#1DB954", iconType: "lucide", iconName: "Music",
  },
  {
    id: "soundcloud",   label: "SoundCloud",       placeholder: "https://soundcloud.com/username",
    category: "content", color: "#FF5500", iconType: "lucide", iconName: "Music2",
  },
  {
    id: "substack",     label: "Substack",         placeholder: "https://username.substack.com",
    category: "content", color: "#FF6719", iconType: "lucide", iconName: "BookOpen",
  },
  {
    id: "medium",       label: "Medium",           placeholder: "https://medium.com/@username",
    category: "content", color: "#000", iconType: "lucide", iconName: "BookMarked",
  },
  {
    id: "patreon",      label: "Patreon",          placeholder: "https://patreon.com/username",
    category: "content", color: "#FF424D", iconType: "text", iconName: "Pa",
  },

  // ── Other ─────────────────────────────────────────────────────────────────
  {
    id: "shop",         label: "Shop / Store",     placeholder: "https://yourshop.com",
    category: "other", color: "#059669", iconType: "lucide", iconName: "ShoppingBag",
  },
  {
    id: "calendar",     label: "Book a call",      placeholder: "https://cal.com/username",
    category: "other", color: "#3B82F6", iconType: "lucide", iconName: "Calendar",
  },
  {
    id: "kofi",         label: "Ko-fi",            placeholder: "https://ko-fi.com/username",
    category: "other", color: "#FF5E5B", iconType: "lucide", iconName: "Coffee",
  },
  {
    id: "custom",       label: "Custom link",      placeholder: "https://",
    category: "other", color: "#6B7280", iconType: "lucide", iconName: "Link",
  },
]

export const PLATFORM_CATEGORIES = [
  { id: "social",         label: "Social"         },
  { id: "professional",   label: "Professional"   },
  { id: "creative",       label: "Creative"       },
  { id: "communication",  label: "Communication"  },
  { id: "content",        label: "Content"        },
  { id: "other",          label: "Other"          },
] as const

export function getPlatformById(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id)
}
