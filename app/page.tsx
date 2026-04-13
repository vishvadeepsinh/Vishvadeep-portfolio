import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { STATIC_PROFILE } from "@/lib/static-data/profile"

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
  const profile = STATIC_PROFILE
  const profileImage = profile.avatar_url || "/placeholder-user.jpg"

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">{profile.name}</h1>
              <p className="text-xl text-foreground/70 mb-6">{profile.title}</p>
              <p className="text-lg text-foreground/60 mb-8">{profile.bio}</p>
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

            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={profileImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lazy-load sections below the fold */}
        <WhatIDoSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
