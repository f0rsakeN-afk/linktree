import { getThemeRegistry } from "@/lib/themes"
import { FONTS } from "@/lib/fonts"
import PlaygroundClient from "./PlaygroundClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Theme Playground — LinkDrop",
  description: "Explore 36 themes and fonts for your link page.",
}

export default function PlaygroundPage() {
  const themes = getThemeRegistry()
  return <PlaygroundClient themes={themes} fonts={FONTS} />
}
