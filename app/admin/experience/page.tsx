"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2, Plus } from "lucide-react"
import { toast } from "sonner"

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
  })

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const response = await fetch("/api/admin/experience")
        const result = await response.json()
        if (result.success) {
          setExperiences(result.data || [])
        }
      } catch (error) {
        toast.error("Failed to load experiences")
      } finally {
        setIsLoading(false)
      }
    }
    loadExperiences()
  }, [])

  const handleEdit = (exp: any) => {
    setEditingId(exp.id)
    setFormData({
      company: exp.company,
      position: exp.position,
      description: exp.description,
      start_date: exp.start_date,
      end_date: exp.end_date,
      is_current: exp.is_current,
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const expData = {
        ...(editingId && editingId !== -1 && { id: editingId }),
        company: formData.company,
        position: formData.position,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.is_current ? null : formData.end_date,
        is_current: formData.is_current,
      }

      const response = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expData),
      })
      const result = await response.json()

      if (result.success) {
        toast.success(editingId === -1 ? "Experience added!" : "Experience updated!")
        // Reload experiences
        const reloadResponse = await fetch("/api/admin/experience")
        const reloadResult = await reloadResponse.json()
        if (reloadResult.success) {
          setExperiences(reloadResult.data || [])
        }
        resetForm()
      } else {
        toast.error("Failed to save experience: " + result.error)
      }
    } catch (error) {
      toast.error("Error saving experience: " + String(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" })
      const result = await response.json()

      if (result.success) {
        toast.success("Experience deleted!")
        setExperiences(experiences.filter((e) => e.id !== id))
      } else {
        toast.error("Failed to delete experience")
      }
    } catch (error) {
      toast.error("Error deleting experience: " + String(error))
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      company: "",
      position: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: false,
    })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading experiences...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Experience</h1>
          <p className="text-foreground/70">Manage your work experience</p>
        </div>
        {!editingId && (
          <Button onClick={() => setEditingId(-1)}>
            <Plus size={16} className="mr-2" />
            Add Experience
          </Button>
        )}
      </div>

      {editingId !== null && (
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId === -1 ? "Add New Experience" : "Edit Experience"}</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Job title"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Job description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  disabled={formData.is_current}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCurrent"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: "" })}
                className="w-4 h-4"
              />
              <label htmlFor="isCurrent" className="text-sm font-medium">
                Currently working here
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Experience"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id} className="p-6 border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{exp.position}</h3>
                  {exp.is_current && <Badge>Current</Badge>}
                </div>
                <p className="text-primary font-medium mb-2">{exp.company}</p>
                <p className="text-sm text-foreground/60 mb-3">
                  {exp.start_date} — {exp.end_date || "Present"}
                </p>
                <p className="text-foreground/70">{exp.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                <Edit2 size={16} className="mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(exp.id)}>
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
