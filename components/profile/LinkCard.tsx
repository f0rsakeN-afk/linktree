import { ReactNode } from "react"

interface LinkItem {
  title: string
  url: string
}

interface Props {
  link: LinkItem
  children?: ReactNode
}

export default function LinkCard({ link, children }: Props) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 w-full px-5 py-3.5 rounded-[var(--radius-lg,0.75rem)] border border-border bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:shadow-[var(--shadow-sm,0_2px_8px_rgba(0,0,0,.1))] active:scale-[0.98]"
    >
      {children && (
        <span className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          {children}
        </span>
      )}
      <span className="flex-1 text-sm font-medium text-center">{link.title}</span>
    </a>
  )
}
