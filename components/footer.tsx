"use client"

import { useCallback } from "react"

import Link from "next/link"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { useState, useEffect, useMemo } from "react"

export function Footer() {
  const [profile, setProfile] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/profile", {
        next: { revalidate: 3600 },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format")
      }

      const result = await response.json()
      if (result.success && result.data) {
        setProfile(result.data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch profile for footer:", error)
    }
  }, [])

  useEffect(() => {
    // Performance: Only fetch on client side after mounting to avoid hydration issues
    setIsMounted(true)

    const controller = new AbortController()

    // Performance: Delay footer fetch to prioritize above-the-fold content
    const timer = setTimeout(() => {
      fetchProfile()
    }, 1000)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [fetchProfile])

  const socialLinks = useMemo(() => {
    if (!profile) return []

    const links = []
    if (profile.github_url) {
      links.push({ href: profile.github_url, icon: Github, label: "GitHub" })
    }
    if (profile.linkedin_url) {
      links.push({ href: profile.linkedin_url, icon: Linkedin, label: "LinkedIn" })
    }
    if (profile.twitter_url) {
      links.push({ href: profile.twitter_url, icon: Twitter, label: "Twitter" })
    }
    if (profile.email) {
      links.push({ href: `mailto:${profile.email}`, icon: Mail, label: "Email" })
    }
    return links
  }, [profile])

  // Performance: Don't render social links until mounted (avoid hydration mismatch)
  if (!isMounted) {
    return null
  }

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{profile?.name || "Vishvadeepsinh"}</h3>
            <p className="text-sm text-foreground/70">
              {profile?.title || "Python Developer | Full-Stack Developer | UI/UX Designer"}
            </p>
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
