import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Code } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  github_url: string
  live_url: string
  featured: boolean
  image_url?: string
}

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch("/api/admin/projects", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error("[v0] Failed to fetch projects:", error)
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()



  const simplifyUrl = (url: string): string => {
    if (!url) return url
    try {
      const urlObj = new URL(url)
      return `${urlObj.origin}${urlObj.pathname}`
    } catch {
      return url
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Projects</h1>
            <p className="text-lg text-foreground/70">
              A selection of projects I've built showcasing my skills in full-stack development, UI/UX design, and data
              analysis.
            </p>
          </div>

          {!projects || projects.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-foreground/60">No projects found. Add some from the admin dashboard!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  {project.image_url ? (
                    <div className="aspect-square overflow-hidden bg-muted relative">
                      <Image
                        src={project.image_url || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        loading={index < 2 ? "eager" : "lazy"}
                        priority={index < 2}
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <p className="text-foreground/60 text-sm">{project.title}</p>
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      {project.featured && <Badge className="ml-2">Featured</Badge>}
                    </div>
                    <p className="text-foreground/70 mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary">+{project.technologies.length - 3}</Badge>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {project.github_url && project.github_url.trim() !== "" && (
                        <Link
                          href={simplifyUrl(project.github_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            aria-label="View project on GitHub"
                          >
                            <Code size={16} />
                            Project
                          </Button>
                        </Link>
                      )}
                      {project.live_url && project.live_url.trim() !== "" && (
                        <Link href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button size="sm" className="w-full">
                            <ExternalLink size={16} className="mr-2" />
                            Live Project
                          </Button>
                        </Link>
                      )}
                      {(!project.github_url || project.github_url.trim() === "") &&
                        (!project.live_url || project.live_url.trim() === "") && (
                          <p className="text-sm text-foreground/50 text-center w-full py-2">No links available</p>
                        )}
                    </div>
                  </div>
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
