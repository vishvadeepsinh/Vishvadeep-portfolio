import Link from "next/link"
import Image from "next/image"
import { NavbarClient } from "./navbar-client"

interface Profile {
  name: string
  avatar_url?: string
}

async function getProfile(): Promise<Profile> {
  try {
    const res = await fetch("/api/admin/profile", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error("Failed to fetch profile")
    const json = await res.json()
    return json.data || { name: "Portfolio" }
  } catch (error) {
    console.error("[v0] Failed to fetch profile for navbar:", error)
    return { name: "Portfolio" }
  }
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export async function Navbar() {
  const profile = await getProfile()
  const avatarUrl = profile.avatar_url || "/placeholder-user.jpg"

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2" prefetch={true}>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
              <Image
                src={avatarUrl}
                alt={profile.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          <div className="hidden md:flex gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <NavbarClient navLinks={NAV_LINKS} />
        </div>
      </div>
    </nav>
  )
}
