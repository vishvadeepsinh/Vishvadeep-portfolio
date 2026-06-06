import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface About {
  title?: string
  intro?: string
  description?: string
  location?: string
  experience_years?: string
  education?: string
  languages?: string[]
  what_drives_me?: string[]
}

async function getAbout(): Promise<About> {
  try {
    const res = await fetch("/api/admin/about", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return {}
    const json = await res.json()
    return json.data || {}
  } catch (error) {
    console.error("[v0] Failed to fetch about:", error)
    return {}
  }
}

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{about?.title || "About Me"}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Who I Am</h2>
              <p className="text-foreground/70 mb-4">{about?.intro}</p>
              <p className="text-foreground/70">{about?.description}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-foreground/60">Location</p>
                  <p className="font-medium">{about?.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Experience</p>
                  <p className="font-medium">{about?.experience_years || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Education</p>
                  <p className="font-medium">{about?.education || "Not specified"}</p>
                </div>
                {about?.languages && about.languages.length > 0 && (
                  <div>
                    <p className="text-sm text-foreground/60">Languages</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {about.languages.map((lang: string, index: number) => (
                        <Badge key={index}>{lang}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {about?.what_drives_me && about.what_drives_me.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">What Drives Me</h2>
              <ul className="space-y-3 text-foreground/70">
                {about.what_drives_me.map((item: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
