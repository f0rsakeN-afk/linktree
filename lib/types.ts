export interface LinkItem {
  id?: string
  title: string
  url: string
  icon?: string | null
  order: number
}

export interface BlockItem {
  id?: string
  type: "TEXT" | "HEADING" | "QUOTE" | "DIVIDER"
  content: string
  order: number
}

export interface ProfileData {
  name: string
  bio?: string | null
  theme: string
  font: string
  links: LinkItem[]
  blocks: BlockItem[]
}
