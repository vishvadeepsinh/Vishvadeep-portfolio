"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Code2, Palette, BarChart3 } from "lucide-react" // Import the missing variables

// Lazy-load heavy components that aren't needed for LCP
const WhatIDoSection = dynamic(() => import("@/components/home/what-i-do"), {
  loading: () => null,
  ssr: true,
})

const CTASection = dynamic(() => import("@/components/home/cta-section"), {
  loading: () => null,
  ssr: true,
})

export default function Home() {
  const [profileImage, setProfileImage] = useState<string>("")
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Optimize: Use AbortController to cancel fetch if component unmounts
    const controller = new AbortController()

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/admin/profile", {
          signal: controller.signal,
          // Performance: Add cache directive
          next: { revalidate: 3600 },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
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
        if (error instanceof Error && error.name === "AbortError") {
          return // Abort is expected on unmount
        }
        console.error("[v0] Failed to fetch profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Performance: Debounce fetch to avoid multiple calls
    const timer = setTimeout(() => {
      fetchProfile()
    }, 0)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
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

      {/* Lazy-load sections below the fold */}
      <Suspense fallback={null}>
        <WhatIDoSection />
      </Suspense>

      <Suspense fallback={null}>
        <CTASection />
      </Suspense>

      <Footer />
    </div>
  )
}
