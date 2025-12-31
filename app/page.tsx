"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, Palette, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function Home() {
  const [profileImage, setProfileImage] = useState<string>("")
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/admin/profile")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text()
          console.error("[v0] Profile fetch error: Non-JSON response received")
          throw new Error("Invalid response format")
        }

        const result = await response.json()

        if (result.success && result.data) {
          setProfile(result.data)
          if (result.data.avatar_url) {
            setProfileImage(result.data.avatar_url)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to fetch profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Hi, I'm <span className="text-primary">{profile?.name || "Loading..."}</span>
              </h1>
              <p className="text-lg text-foreground/70 mb-8 text-balance">{profile?.title || "Loading..."}</p>
              <p className="text-base text-foreground/60 mb-8 max-w-lg">{profile?.bio || "Loading..."}</p>
              <div className="flex gap-4">
                <Link href="/projects">
                  <Button size="lg">
                    View My Work
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              {profileImage ? (
                <div className="w-full aspect-square rounded-lg overflow-hidden shadow-lg bg-muted/30 relative">
                  <Image
                    src={profileImage || "/placeholder.svg"}
                    alt={profile?.name || "Profile"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👨‍💻</div>
                    <p className="text-foreground/60">Full-Stack Developer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What I Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <Code2 className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Full-Stack Development</h3>
              <p className="text-foreground/70">
                Building scalable web applications with Python/Django, Node.js, React, and modern databases.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <Palette className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">UI/UX Design</h3>
              <p className="text-foreground/70">
                Creating intuitive and beautiful user interfaces with Figma, focusing on user experience.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <BarChart3 className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Data Analysis</h3>
              <p className="text-foreground/70">
                Deriving insights from data using Tableau, Power BI, and Python for data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Work Together?</h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and opportunities.
          </p>
          <Link href="/contact">
            <Button size="lg">
              Start a Conversation
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
