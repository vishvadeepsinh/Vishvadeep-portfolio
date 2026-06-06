import Link from "next/link"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"

interface Profile {
  name: string
  title: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  email?: string
}

async function getProfile(): Promise<Profile> {
  try {
    const res = await fetch("/api/admin/profile", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error("Failed to fetch profile")
    const json = await res.json()
    return json.data || { name: "Portfolio", title: "Developer" }
  } catch (error) {
    console.error("[v0] Failed to fetch profile for footer:", error)
    return { name: "Portfolio", title: "Developer" }
  }
}

export async function Footer() {
  const profile = await getProfile()

  const socialLinks = [
    ...(profile.github_url ? [{ href: profile.github_url, icon: Github, label: "GitHub" }] : []),
    ...(profile.linkedin_url ? [{ href: profile.linkedin_url, icon: Linkedin, label: "LinkedIn" }] : []),
    ...(profile.twitter_url ? [{ href: profile.twitter_url, icon: Twitter, label: "Twitter" }] : []),
    ...(profile.email ? [{ href: `mailto:${profile.email}`, icon: Mail, label: "Email" }] : []),
  ]

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{profile.name}</h3>
            <p className="text-sm text-foreground/70">{profile.title}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/projects" className="text-foreground/70 hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-foreground/70 hover:text-foreground transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/experience" className="text-foreground/70 hover:text-foreground transition-colors">
                  Experience
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-foreground/70">
          <p>&copy; 2025 {profile?.name || "Vishvadeepsinh Chudasama"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
