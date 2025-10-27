"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Download, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjectPreview {
  title: string
  description: string
  technologies: string[]
  live_url: string | null
  featured: boolean
  created_at: string
}

interface ImportError {
  row: number
  field: string
  message: string
}

export default function ImportProjectsPage() {
  const [csvUrl, setCsvUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<ProjectPreview[]>([])
  const [errors, setErrors] = useState<ImportError[]>([])
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const { toast } = useToast()

  const addDebugLog = (message: string) => {
    console.log(`[v0] ${message}`)
    setDebugInfo((prev) => [...prev, `${new Date().toISOString()} - ${message}`])
  }

  const validateCSVStructure = (csvText: string) => {
    addDebugLog("Validating CSV structure...")
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    addDebugLog(`Found ${headers.length} headers: ${headers.join(", ")}`)
    addDebugLog(`Total rows: ${lines.length - 1}`)

    const requiredHeaders = ["Project name", "Date", "Design link", "HOURS", "Status"]
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
    }

    return { headers, rowCount: lines.length - 1 }
  }

  const parseCSV = (csvText: string) => {
    addDebugLog("Parsing CSV data...")

    // Normalize line endings
    csvText = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

    // Remove BOM if present
    if (csvText.charCodeAt(0) === 0xfeff) {
      csvText = csvText.slice(1)
      addDebugLog("Removed BOM from CSV")
    }

    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    const parsedData: any[] = []
    const parseErrors: ImportError[] = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) {
        addDebugLog(`Skipping empty row ${i}`)
        continue
      }

      try {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const row: any = {}

        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })

        // Validate required fields
        if (!row["Project name"]) {
          parseErrors.push({
            row: i,
            field: "Project name",
            message: "Missing project name",
          })
          continue
        }

        parsedData.push(row)
      } catch (error) {
        addDebugLog(`Error parsing row ${i}: ${error}`)
        parseErrors.push({
          row: i,
          field: "general",
          message: error instanceof Error ? error.message : "Parse error",
        })
      }
    }

    addDebugLog(`Successfully parsed ${parsedData.length} rows`)
    if (parseErrors.length > 0) {
      addDebugLog(`Found ${parseErrors.length} parsing errors`)
    }

    return { data: parsedData, errors: parseErrors }
  }

  const transformToProject = (row: any, index: number): ProjectPreview => {
    const title = row["Project name"].substring(0, 100)
    const description = `Design project: ${row["Project name"]} | Time spent: ${row["HOURS"]} | Status: ${row["Status"]}`

    return {
      title,
      description,
      technologies: ["Canva"],
      live_url: row["Design link"] || null,
      featured: row["Status"]?.toLowerCase() === "completed",
      created_at: new Date().toISOString(),
    }
  }

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
    setDebugInfo([])
    setErrors([])

    try {
      addDebugLog(`Fetching CSV from: ${csvUrl}`)

      const response = await fetch(csvUrl)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      addDebugLog(`Response status: ${response.status}`)

      const csvText = await response.text()
      addDebugLog(`Received ${csvText.length} characters`)
      addDebugLog(`First 200 chars: ${csvText.substring(0, 200)}`)

      // Validate structure
      const { headers, rowCount } = validateCSVStructure(csvText)
      addDebugLog(`Validation passed: ${rowCount} data rows`)

      // Parse CSV
      const { data: parsedData, errors: parseErrors } = parseCSV(csvText)
      setErrors(parseErrors)

      // Transform to projects
      const transformedProjects = parsedData.map((row, index) => transformToProject(row, index))

      addDebugLog(`Transformed ${transformedProjects.length} projects`)
      setProjects(transformedProjects)

      toast({
        title: "Success",
        description: `Parsed ${transformedProjects.length} projects from CSV${parseErrors.length > 0 ? ` (${parseErrors.length} errors)` : ""}`,
      })
    } catch (error) {
      addDebugLog(`Error: ${error}`)
      console.error("[v0] Error fetching CSV:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch or parse CSV file",
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
    addDebugLog(`Starting import of ${projects.length} projects...`)

    try {
      let successCount = 0
      let errorCount = 0
      const importErrors: string[] = []

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i]
        addDebugLog(`Importing ${i + 1}/${projects.length}: ${project.title}`)

        try {
          const response = await fetch("/api/admin/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
          })

          if (response.ok) {
            successCount++
            addDebugLog(`✓ Successfully imported: ${project.title}`)
          } else {
            errorCount++
            const errorText = await response.text()
            addDebugLog(`✗ Failed to import: ${project.title} - ${errorText}`)
            importErrors.push(`${project.title}: ${errorText}`)
          }
        } catch (error) {
          errorCount++
          const errorMsg = error instanceof Error ? error.message : "Unknown error"
          addDebugLog(`✗ Exception importing: ${project.title} - ${errorMsg}`)
          importErrors.push(`${project.title}: ${errorMsg}`)
        }
      }

      addDebugLog(`Import complete: ${successCount} success, ${errorCount} failed`)

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
      addDebugLog(`Critical error: ${error}`)
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
            <p className="text-xs text-muted-foreground mt-1">
              Paste the direct URL to your CSV file (must be publicly accessible)
            </p>
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
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">Import completed successfully!</AlertDescription>
            </Alert>
          )}

          {importStatus === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>Some projects failed to import. Check debug logs below.</AlertDescription>
            </Alert>
          )}

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Found {errors.length} parsing errors. These rows will be skipped.</AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Debug Logs */}
      {debugInfo.length > 0 && (
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-2">Debug Logs</h3>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-xs max-h-64 overflow-y-auto">
            {debugInfo.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </Card>
      )}

      {/* Parsing Errors */}
      {errors.length > 0 && (
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-2 text-red-600">Parsing Errors ({errors.length})</h3>
          <div className="space-y-2">
            {errors.slice(0, 10).map((error, index) => (
              <div key={index} className="text-sm text-red-600">
                Row {error.row}, Field "{error.field}": {error.message}
              </div>
            ))}
            {errors.length > 10 && (
              <p className="text-sm text-muted-foreground">... and {errors.length - 10} more errors</p>
            )}
          </div>
        </Card>
      )}

      {/* Project Preview */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Preview ({projects.length} projects)</h2>
          <div className="space-y-4">
            {projects.slice(0, 10).map((project, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                <div className="flex gap-2 text-xs flex-wrap">
                  <span className="px-2 py-1 bg-primary/10 rounded">{project.technologies.join(", ")}</span>
                  {project.featured && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded">Featured</span>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded hover:bg-blue-500/20"
                    >
                      View Design
                    </a>
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
