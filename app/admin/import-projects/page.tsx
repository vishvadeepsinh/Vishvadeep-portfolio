"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Download, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface ProjectPreview {
  title: string
  description: string
  technologies: string[]
  live_url: string | null
  featured: boolean
  created_at: string
}

export default function ImportProjectsPage() {
  const [csvUrl, setCsvUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<ProjectPreview[]>([])
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleFetchProjects = async () => {
    if (!csvUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a CSV URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setImportStatus("idle")

    try {
      const response = await fetch(csvUrl)
      const csvText = await response.text()

      // Parse CSV
      const lines = csvText.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

      const parsedProjects: ProjectPreview[] = []

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue

        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const row: any = {}

        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })

        // Transform to project format
        if (row["Project name"]) {
          const title = row["Project name"].substring(0, 100)
          const description = `Design project: ${row["Project name"]} | Time spent: ${row["HOURS"]} | Status: ${row["Status"]}`

          parsedProjects.push({
            title,
            description,
            technologies: ["Canva"],
            live_url: row["Design link"] || null,
            featured: row["Status"]?.toLowerCase() === "completed",
            created_at: new Date().toISOString(),
          })
        }
      }

      setProjects(parsedProjects)
      toast({
        title: "Success",
        description: `Parsed ${parsedProjects.length} projects from CSV`,
      })
    } catch (error) {
      console.error("[v0] Error fetching CSV:", error)
      toast({
        title: "Error",
        description: "Failed to fetch or parse CSV file",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportProjects = async () => {
    if (projects.length === 0) {
      toast({
        title: "Error",
        description: "No projects to import",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Import projects one by one
      let successCount = 0
      let errorCount = 0

      for (const project of projects) {
        try {
          const response = await fetch("/api/admin/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
          })

          if (response.ok) {
            successCount++
          } else {
            errorCount++
          }
        } catch (error) {
          errorCount++
        }
      }

      if (errorCount === 0) {
        setImportStatus("success")
        toast({
          title: "Import Complete",
          description: `Successfully imported ${successCount} projects`,
        })
        setProjects([])
        setCsvUrl("")
      } else {
        setImportStatus("error")
        toast({
          title: "Partial Import",
          description: `Imported ${successCount} projects, ${errorCount} failed`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Import error:", error)
      setImportStatus("error")
      toast({
        title: "Error",
        description: "Failed to import projects",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Design Projects</h1>
        <p className="text-muted-foreground">Import design projects from CSV file into the database</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="csvUrl">CSV File URL</Label>
            <Input
              id="csvUrl"
              type="url"
              placeholder="https://example.com/projects.csv"
              value={csvUrl}
              onChange={(e) => setCsvUrl(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleFetchProjects} disabled={isLoading || !csvUrl.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Fetch & Preview
                </>
              )}
            </Button>

            {projects.length > 0 && (
              <Button onClick={handleImportProjects} disabled={isLoading} variant="default">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import {projects.length} Projects
                  </>
                )}
              </Button>
            )}
          </div>

          {importStatus === "success" && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Import completed successfully!</span>
            </div>
          )}

          {importStatus === "error" && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>Some projects failed to import</span>
            </div>
          )}
        </div>
      </Card>

      {projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Preview ({projects.length} projects)</h2>
          <div className="space-y-4">
            {projects.slice(0, 10).map((project, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-primary/10 rounded">{project.technologies.join(", ")}</span>
                  {project.featured && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded">Featured</span>
                  )}
                </div>
              </Card>
            ))}
            {projects.length > 10 && (
              <p className="text-sm text-muted-foreground text-center">... and {projects.length - 10} more projects</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
