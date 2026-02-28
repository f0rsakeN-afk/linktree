import CreateFlow from "@/components/auth/CreateFlow"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create your page — LinkDrop",
  description: "Create your personal link page. No password required.",
}

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border px-6 h-14 flex items-center justify-between max-w-screen-sm mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-primary" />
          <span className="font-semibold tracking-tight text-sm">LinkDrop</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <CreateFlow />
      </main>
    </div>
  )
}
