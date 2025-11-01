"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects")
      const data = await response.json()

      if (data.success) {
        setProjects(data.data || [])
      }
    } catch (error) {
      console.error("[v0] Failed to fetch projects:", error)
    } finally {
      setLoading(false)
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-foreground/60">No projects found. Add some from the admin dashboard!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  {project.image_url ? (
                    <div className="h-48 overflow-hidden bg-muted">
                      <img
                        src={project.image_url || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
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
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project.github_url && project.github_url.trim() !== "" && (
                        <Link href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <Github size={16} className="mr-2" />
                            Code
                          </Button>
                        </Link>
                      )}
                      {project.live_url && project.live_url.trim() !== "" && (
                        <Link href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button size="sm" className="w-full">
                            <ExternalLink size={16} className="mr-2" />
                            Project
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
