"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2, Plus } from "lucide-react"
import { toast } from "sonner"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    technologies: "",
    github: "",
    live: "",
    featured: false,
  })
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/admin/projects")
        const result = await response.json()
        if (result.success) {
          setProjects(result.data || [])
        }
      } catch (error) {
        toast.error("Failed to load projects")
      } finally {
        setIsLoading(false)
      }
    }
    loadProjects()
  }, [])

  const handleEdit = (project: any) => {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url || "",
      technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies,
      github: project.github_url,
      live: project.live_url,
      featured: project.featured,
    })
    setImagePreview(project.image_url || "")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({ ...formData, image_url: base64String })
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const projectData = {
        ...(editingId && editingId !== -1 && { id: editingId }),
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        technologies: formData.technologies.split(",").map((t) => t.trim()),
        github_url: formData.github,
        live_url: formData.live,
        featured: formData.featured,
      }

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      })
      const result = await response.json()

      if (result.success) {
        toast.success(editingId === -1 ? "Project added!" : "Project updated!")
        const reloadResponse = await fetch("/api/admin/projects")
        const reloadResult = await reloadResponse.json()
        if (reloadResult.success) {
          setProjects(reloadResult.data || [])
        }
        resetForm()
      } else {
        toast.error("Failed to save project: " + result.error)
      }
    } catch (error) {
      toast.error("Error saving project: " + String(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" })
      const result = await response.json()

      if (result.success) {
        toast.success("Project deleted!")
        setProjects(projects.filter((p) => p.id !== id))
      } else {
        toast.error("Failed to delete project")
      }
    } catch (error) {
      toast.error("Error deleting project: " + String(error))
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      image_url: "",
      technologies: "",
      github: "",
      live: "",
      featured: false,
    })
    setImagePreview("")
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-foreground/70">Manage your portfolio projects</p>
        </div>
        {!editingId && (
          <Button onClick={() => setEditingId(-1)}>
            <Plus size={16} className="mr-2" />
            Add Project
          </Button>
        )}
      </div>

      {editingId !== null && (
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId === -1 ? "Add New Project" : "Edit Project"}</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Project Image</label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Project preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="cursor-pointer" />
                    <p className="text-xs text-foreground/60 mt-1">Upload an image (max 5MB)</p>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={formData.image_url.startsWith("data:") ? "" : formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value })
                        setImagePreview(e.target.value)
                      }}
                      placeholder="Or paste image URL"
                    />
                    <p className="text-xs text-foreground/60 mt-1">Or paste an image URL</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
              <Input
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <Input
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Live URL</label>
                <Input
                  value={formData.live}
                  onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured Project
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Project"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  {project.featured && <Badge>Featured</Badge>}
                </div>
                <p className="text-foreground/70 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(project.technologies) &&
                    project.technologies.map((tech: string) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                </div>
                {project.image_url && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border mb-4">
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt="Project image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                <Edit2 size={16} className="mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
