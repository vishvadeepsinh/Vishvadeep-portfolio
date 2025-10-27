"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Plus } from "lucide-react"
import { toast } from "sonner"

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    proficiency: 50,
  })

  const categories = [
    "Programming Languages",
    "Frameworks & Libraries",
    "Web Development",
    "Databases",
    "UI/UX Design",
    "Data Analytics & Visualization",
    "AI & Automation",
    "Tools & Platforms",
    "Professional Skills",
    "Soft Skills",
  ]

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch("/api/admin/skills")
        const result = await response.json()
        if (result.success) {
          setSkills(result.data || [])
        }
      } catch (error) {
        toast.error("Failed to load skills")
      } finally {
        setIsLoading(false)
      }
    }
    loadSkills()
  }, [])

  const handleEdit = (skill: any) => {
    setEditingId(skill.id)
    setFormData({
      category: skill.category,
      name: skill.name,
      proficiency: skill.proficiency,
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const skillData = {
        ...(editingId && editingId !== -1 && { id: editingId }),
        category: formData.category,
        name: formData.name,
        proficiency: formData.proficiency,
      }

      const response = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData),
      })
      const result = await response.json()

      if (result.success) {
        toast.success(editingId === -1 ? "Skill added!" : "Skill updated!")
        // Reload skills
        const reloadResponse = await fetch("/api/admin/skills")
        const reloadResult = await reloadResponse.json()
        if (reloadResult.success) {
          setSkills(reloadResult.data || [])
        }
        resetForm()
      } else {
        toast.error("Failed to save skill: " + result.error)
      }
    } catch (error) {
      toast.error("Error saving skill: " + String(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" })
      const result = await response.json()

      if (result.success) {
        toast.success("Skill deleted!")
        setSkills(skills.filter((s) => s.id !== id))
      } else {
        toast.error("Failed to delete skill")
      }
    } catch (error) {
      toast.error("Error deleting skill: " + String(error))
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      category: "",
      name: "",
      proficiency: 50,
    })
  }

  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, any[]>,
  )

  if (isLoading) {
    return <div className="text-center py-8">Loading skills...</div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skills</h1>
          <p className="text-foreground/70">Manage your skills and proficiency levels</p>
        </div>
        {!editingId && (
          <Button onClick={() => setEditingId(-1)}>
            <Plus size={16} className="mr-2" />
            Add Skill
          </Button>
        )}
      </div>

      {editingId !== null && (
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{editingId === -1 ? "Add New Skill" : "Edit Skill"}</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Skill Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Python, React"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Proficiency Level: {formData.proficiency}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: Number.parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Skill"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-8">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="space-y-3">
              {categorySkills.map((skill: any) => (
                <Card key={skill.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{skill.name}</h3>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                      <p className="text-sm text-foreground/60 mt-1">{skill.proficiency}%</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(skill)}>
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
