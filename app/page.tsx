import Link from "next/link"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import { ArrowRight, KeyRound, Palette, Github, Twitter, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/15">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="max-w-5xl mx-auto px-5 sm:px-8 pt-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-primary transition-all group-hover:rotate-6 group-hover:scale-110" />
          <span className="font-semibold text-sm tracking-tight">LinkDrop</span>
        </Link>
        <nav className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/playground">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground">
              Themes
            </Button>
          </Link>
          <Link href="/edit">
            <Button variant="ghost" size="sm" className="text-muted-foreground">Sign in</Button>
          </Link>
          <Link href="/create">
            <Button size="sm" className="press gap-1.5 ml-1">
              Create page
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8">

        {/* Big headline */}
        <section className="pt-16 sm:pt-24 pb-14 sm:pb-20 space-y-7">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
              The Open-Source Link in Bio
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[0.95] text-foreground">
              Your corner&apos;s<br />of the internet, elevated.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              A clean, minimal, and fully-customizable page for all your content. Open-source, secured by cryptographic keys, and designed for professionals.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/create">
              <Button size="lg" className="h-11 px-7 press hover-lift gap-2 shadow-sm">
                Make mine free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="h-11 px-7 press hover-lift gap-2">
                Try the demo
              </Button>
            </Link>
          </div>
        </section>

        {/* ── Side-by-side: demo + features ── */}
        <section className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Mock profile card */}
          <div className="relative">
            <div className="rounded-3xl border border-border bg-card overflow-hidden max-w-xs mx-auto lg:mx-0 shadow-xl">
              {/* Top gradient strip */}
              <div className="h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />

              <div className="px-7 py-8 space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold shrink-0">
                    AJ
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Alex Johnson</p>
                    <p className="text-xs text-muted-foreground font-mono">@alexj</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Product Designer</p>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-2">
                  {[
                    { icon: <Globe className="w-3.5 h-3.5" />, label: "Portfolio" },
                    { icon: <Twitter className="w-3.5 h-3.5" />, label: "Twitter / X" },
                    { icon: <Github className="w-3.5 h-3.5" />, label: "GitHub" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium cursor-default"
                    >
                      <span className="opacity-70 shrink-0">{item.icon}</span>
                      <span className="flex-1 text-center">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xs italic text-muted-foreground border-l-2 border-primary pl-3 leading-relaxed">
                  &ldquo;Design is how it works, not just how it looks.&rdquo;
                </blockquote>
              </div>

              {/* Bottom bar */}
              <div className="px-7 py-3 border-t border-border bg-muted/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">linkdrop.app/alexj</span>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl px-3.5 py-2.5 shadow-lg hidden sm:block animate-float">
              <p className="text-xs font-semibold">36 themes</p>
              <p className="text-[10px] text-muted-foreground">pick your vibe</p>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Enterprise-grade architecture.</h2>
              <p className="text-muted-foreground text-sm">Engineered for security, speed, and developer experience.</p>
            </div>

            <div className="space-y-5">
              {[
                {
                  icon: <KeyRound className="w-4 h-4" />,
                  title: "Stateless Security",
                  desc: "Authentication via cryptographic keys. No centralized passwords or external database dependencies for access.",
                },
                {
                  icon: <Palette className="w-4 h-4" />,
                  title: "Extensive Customization",
                  desc: "36 meticulously crafted themes spanning elegant minimalism to vibrant brutalism, completely customizable.",
                },
                {
                  icon: <Globe className="w-4 h-4" />,
                  title: "Rich Content Blocks",
                  desc: "Integrate platforms, embed media, and compose free-form text with a powerful block-based editor.",
                },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    {f.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/playground">
              <Button variant="outline" className="gap-2 press mt-2">
                <Palette className="w-4 h-4" />
                Browse all 36 themes
              </Button>
            </Link>
          </div>
        </section>

        {/* ── How it works (timeline) ── */}
        <section className="py-16 sm:py-24 border-t border-border">
          <div className="max-w-2xl space-y-10">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Frictionless deployment.</h2>
              <p className="text-muted-foreground text-sm">From configuration to production in seconds.</p>
            </div>

            <div className="space-y-0">
              {[
                { n: "1", title: "Claim your identity", desc: "Reserve your unique handle across the platform without complex verification." },
                { n: "2", title: "Secure your access", desc: "Generate and store your stateless cryptographic keys for future modifications." },
                { n: "3", title: "Compose your layout", desc: "Utilize pre-built integrations and customizable themes to build your page." },
                { n: "4", title: "Publish instantly", desc: "Changes propagate immediately to your edge-optimized public profile." },
              ].map((step, i) => (
                <div key={step.n} className="flex gap-5 group">
                  {/* Step connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-border bg-background flex items-center justify-center font-mono text-xs font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors shrink-0">
                      {step.n}
                    </div>
                    {i < 3 && <div className="w-px flex-1 bg-border min-h-[2rem] my-1" />}
                  </div>
                  <div className={`pb-8 pt-1 ${i === 3 ? "pb-0" : ""}`}>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-14 sm:py-20 border-t border-border">
          <div className="space-y-5 max-w-md">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Ready to deploy<br />your profile?
            </h2>
            <p className="text-muted-foreground text-sm">
              Open-source, privacy-first, and beautifully designed.
            </p>
            <Link href="/create">
              <Button size="lg" className="h-11 px-8 press hover-lift gap-2 shadow-sm">
                Create my page
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-5 sm:px-8 py-7">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span>LinkDrop</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/playground" className="hover:text-foreground transition-colors">Themes</Link>
            <Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link>
            <Link href="/create" className="hover:text-foreground transition-colors">Create</Link>
            <Link href="/edit" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
