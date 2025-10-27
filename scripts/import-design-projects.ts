/**
 * Design Projects Import Script
 *
 * This script fetches design project data from a CSV file and imports it into the database.
 * It handles data validation, cleaning, and mapping to the projects table schema.
 */

interface DesignProjectCSV {
  "Sr No.": string
  "Project name": string
  Date: string
  "Design link": string
  "Content Link": string
  "Drive Design link": string
  HOURS: string
  "Revision Required": string
  "Revisions design": string
  "Revision content": string
  "Client feedback": string
  Status: string
  "Column 13"?: string
}

interface ProjectData {
  title: string
  description: string
  technologies: string[]
  github_url: string | null
  live_url: string | null
  image_url: string | null
  featured: boolean
  order_index: number
  created_at: string
}

/**
 * Parse CSV data from the provided URL
 */
async function fetchCSVData(url: string): Promise<DesignProjectCSV[]> {
  try {
    const response = await fetch(url)
    const csvText = await response.text()

    // Parse CSV manually (simple implementation)
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    const data: DesignProjectCSV[] = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      const row: any = {}

      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })

      data.push(row as DesignProjectCSV)
    }

    return data
  } catch (error) {
    console.error("[v0] Error fetching CSV:", error)
    throw error
  }
}

/**
 * Extract technologies from project name and description
 */
function extractTechnologies(projectName: string): string[] {
  const technologies: string[] = []

  // Common design tools
  const designTools = ["Canva", "Figma", "Photoshop", "Illustrator", "InDesign"]

  designTools.forEach((tool) => {
    if (projectName.toLowerCase().includes(tool.toLowerCase())) {
      technologies.push(tool)
    }
  })

  // Default to Canva if no specific tool found
  if (technologies.length === 0) {
    technologies.push("Canva")
  }

  return technologies
}

/**
 * Generate project description from CSV data
 */
function generateDescription(csvRow: DesignProjectCSV): string {
  const parts: string[] = []

  // Add project details
  if (csvRow["Project name"]) {
    parts.push(`Design project: ${csvRow["Project name"]}`)
  }

  // Add time information
  if (csvRow["HOURS"]) {
    parts.push(`Time spent: ${csvRow["HOURS"]}`)
  }

  // Add status
  if (csvRow["Status"]) {
    parts.push(`Status: ${csvRow["Status"]}`)
  }

  // Add revision info if applicable
  if (csvRow["Revision Required"] && csvRow["Revision Required"] !== "N/A") {
    parts.push(`Revisions: ${csvRow["Revision Required"]}`)
  }

  return parts.join(" | ")
}

/**
 * Clean and validate project title
 */
function cleanTitle(title: string): string {
  // Remove extra whitespace
  let cleaned = title.trim()

  // Limit length to 100 characters
  if (cleaned.length > 100) {
    cleaned = cleaned.substring(0, 97) + "..."
  }

  return cleaned
}

/**
 * Parse date string to ISO format
 */
function parseDate(dateStr: string): string {
  try {
    // Handle DD/MM/YYYY format
    const parts = dateStr.split("/")
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0")
      const month = parts[1].padStart(2, "0")
      const year = parts[2]
      return `${year}-${month}-${day}T00:00:00Z`
    }
  } catch (error) {
    console.error("[v0] Error parsing date:", dateStr)
  }

  // Default to current date if parsing fails
  return new Date().toISOString()
}

/**
 * Transform CSV row to project data
 */
function transformToProject(csvRow: DesignProjectCSV, index: number): ProjectData {
  return {
    title: cleanTitle(csvRow["Project name"]),
    description: generateDescription(csvRow),
    technologies: extractTechnologies(csvRow["Project name"]),
    github_url: null, // Design projects typically don't have GitHub repos
    live_url: csvRow["Design link"] || null,
    image_url: null, // Will be added manually later
    featured: csvRow["Status"]?.toLowerCase() === "completed",
    order_index: index,
    created_at: parseDate(csvRow["Date"]),
  }
}

/**
 * Main import function
 */
export async function importDesignProjects(csvUrl: string) {
  console.log("[v0] Starting design projects import...")

  try {
    // Fetch CSV data
    const csvData = await fetchCSVData(csvUrl)
    console.log(`[v0] Fetched ${csvData.length} projects from CSV`)

    // Transform data
    const projects = csvData
      .filter((row) => row["Project name"] && row["Project name"].trim())
      .map((row, index) => transformToProject(row, index))

    console.log(`[v0] Transformed ${projects.length} valid projects`)

    // Return projects for manual review or database insertion
    return projects
  } catch (error) {
    console.error("[v0] Import failed:", error)
    throw error
  }
}

// Export for use in other scripts
export type { DesignProjectCSV, ProjectData }
