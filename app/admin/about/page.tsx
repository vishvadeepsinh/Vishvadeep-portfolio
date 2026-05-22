"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminAboutPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    intro: "",
    description: "",
    location: "",
    experience_years: "",
    education: "",
    languages: [] as string[],
    what_drives_me: [] as string[],
  })
  const [newLanguage, setNewLanguage] = useState("")
  const [newMotivation, setNewMotivation] = useState("")

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const response = await fetch("/api/admin/about")
      const result = await response.json()

      if (result.data) {
        setFormData({
          title: result.data.title || "",
          intro: result.data.intro || "",
          description: result.data.description || "",
          location: result.data.location || "",
          experience_years: result.data.experience_years || "",
          education: result.data.education || "",
          languages: result.data.languages || [],
          what_drives_me: result.data.what_drives_me || [],
        })
      }
    } catch (error) {
      console.error("[v0] Failed to fetch about:", error)
      toast({
        title: "Error",
        description: "Failed to load about data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "About content saved successfully",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save about content",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({ ...formData, languages: [...formData.languages, newLanguage.trim()] })
      setNewLanguage("")
    }
  }

  const removeLanguage = (index: number) => {
    setFormData({ ...formData, languages: formData.languages.filter((_, i) => i !== index) })
  }

  const addMotivation = () => {
    if (newMotivation.trim()) {
      setFormData({ ...formData, what_drives_me: [...formData.what_drives_me, newMotivation.trim()] })
      setNewMotivation("")
    }
  }

  const removeMotivation = (index: number) => {
    setFormData({ ...formData, what_drives_me: formData.what_drives_me.filter((_, i) => i !== index) })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">About Page Content</h2>
        <p className="text-foreground/60">Manage the content displayed on your About page</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Page Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="About Me"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="intro">Introduction</Label>
          <Textarea
            id="intro"
            value={formData.intro}
            onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
            placeholder="Brief introduction about yourself"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description about your journey and interests"
            rows={5}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              placeholder="1.5+ Years"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Textarea
            id="education"
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            placeholder="Your educational background"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Languages</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add a language"
              onKeyPress={(e) => e.key === "Enter" && addLanguage()}
            />
            <Button type="button" onClick={addLanguage} size="icon">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((lang, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {lang}
                <button onClick={() => removeLanguage(index)} className="ml-1 hover:text-destructive">
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>What Drives Me</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newMotivation}
              onChange={(e) => setNewMotivation(e.target.value)}
              placeholder="Add a motivation"
              onKeyPress={(e) => e.key === "Enter" && addMotivation()}
            />
            <Button type="button" onClick={addMotivation} size="icon">
              <Plus size={16} />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.what_drives_me.map((item, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                <span className="text-primary mt-1">✓</span>
                <span className="flex-1">{item}</span>
                <button onClick={() => removeMotivation(index)} className="hover:text-destructive">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Card>
    </div>
  )
}
