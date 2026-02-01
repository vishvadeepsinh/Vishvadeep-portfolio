"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useCachedFetch } from "@/hooks/use-cached-fetch"

interface Experience {
  id: number
  company: string
  position: string
  description: string
  start_date: string
  end_date: string | null
  is_current: boolean
}

export default function ExperiencePage() {
  const { data: experiences, loading } = useCachedFetch<Experience[]>("/api/admin/experience", {
    cacheKey: "experience",
    cacheTTL: 300000, // 5 minutes
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Experience</h1>
            <p className="text-lg text-foreground/70">
              My professional journey and roles that have shaped my expertise in full-stack development and technology.
            </p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))}
            </div>
          ) : !experiences || experiences.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-foreground/60">No experience found. Add some from the admin dashboard!</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {experiences.map((exp) => (
                <Card key={exp.id} className="p-6 border-l-4 border-l-primary">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{exp.position}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    {exp.is_current && <Badge className="ml-2">Current</Badge>}
                  </div>
                  <p className="text-sm text-foreground/60 mb-4">
                    {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date!)}
                  </p>
                  <p className="text-foreground/70">{exp.description}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
