import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import WhatIDo from "@/components/home/what-i-do"
import CTASection from "@/components/home/cta-section"

interface Profile {
  name: string
  title: string
  bio: string
  avatar_url?: string
}

async function getProfile(): Promise<Profile> {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/admin/profile`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error("Failed to fetch profile")
    const json = await res.json()
    return json.data || { name: "Portfolio", title: "Developer", bio: "Welcome" }
  } catch (error) {
    console.error("[v0] Failed to fetch profile:", error)
    return { name: "Portfolio", title: "Developer", bio: "Welcome" }
  }
}

export default async function Home() {
  const profile = await getProfile()
  const profileImage = profile.avatar_url || "/placeholder-user.jpg"

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Hi, I'm <span className="text-primary">{profile.name}</span>
              </h1>
              <p className="text-lg text-foreground/70 mb-8 text-balance">{profile.title}</p>
              <p className="text-base text-foreground/60 mb-8 max-w-lg">{profile.bio}</p>
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

      {/* What I Do Section */}
      <WhatIDo />

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  )
}
