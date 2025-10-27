"use client"

import type React from "react"
import { Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "Vishvadeepsinh Chudasama",
    title: "Python Developer | Full-Stack Developer | UI/UX Designer | Data Analyst",
    bio: "Versatile tech professional with over 1.5+ years of experience...",
    email: "vishvadeepsinh3301@gmail.com",
    phone: "+91 6377646514",
    location: "Ahmedabad, Gujarat, India",
    avatar_url: "",
    github_url: "https://github.com",
    linkedin_url: "https://linkedin.com",
    twitter_url: "",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/admin/profile")
        const result = await response.json()
        if (result.success && result.data) {
          const sanitizedData = {
            name: result.data.name ?? "",
            title: result.data.title ?? "",
            bio: result.data.bio ?? "",
            email: result.data.email ?? "",
            phone: result.data.phone ?? "",
            location: result.data.location ?? "",
            avatar_url: result.data.avatar_url ?? "",
            github_url: result.data.github_url ?? "",
            linkedin_url: result.data.linkedin_url ?? "",
            twitter_url: result.data.twitter_url ?? "",
          }
          setProfile(sanitizedData)
          if (sanitizedData.avatar_url) {
            setImagePreview(sanitizedData.avatar_url)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to load profile:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
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
        const result = reader.result as string
        setImagePreview(result)
        setProfile((prev) => ({ ...prev, avatar_url: result }))
        toast.success("Image preview ready - click Save to store")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log(
        "[v0] Saving profile with avatar_url:",
        profile.avatar_url ? `${profile.avatar_url.substring(0, 50)}...` : "empty",
      )

      const response = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      const result = await response.json()

      console.log("[v0] Save response:", result)

      if (result.success) {
        toast.success("Profile saved successfully!")
        const sanitizedData = {
          name: result.data.name ?? "",
          title: result.data.title ?? "",
          bio: result.data.bio ?? "",
          email: result.data.email ?? "",
          phone: result.data.phone ?? "",
          location: result.data.location ?? "",
          avatar_url: result.data.avatar_url ?? "",
          github_url: result.data.github_url ?? "",
          linkedin_url: result.data.linkedin_url ?? "",
          twitter_url: result.data.twitter_url ?? "",
        }
        setProfile(sanitizedData)
        if (sanitizedData.avatar_url) {
          setImagePreview(sanitizedData.avatar_url)
          console.log("[v0] Image saved and preview updated")
        }
      } else {
        toast.error("Failed to save profile: " + result.error)
      }
    } catch (error) {
      console.error("[v0] Save error:", error)
      toast.error("Error saving profile: " + String(error))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading profile...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-foreground/70">Manage your profile information</p>
      </div>

      <Card className="p-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4">Profile Picture</label>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                {imagePreview || profile.avatar_url ? (
                  <img
                    src={imagePreview || profile.avatar_url}
                    alt="Profile"
                    className="w-32 h-32 rounded-lg object-cover border border-border"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-muted border border-border flex items-center justify-center">
                    <span className="text-4xl">👨‍💻</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:opacity-90 transition-opacity w-fit">
                  <Upload size={18} />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <p className="text-sm text-foreground/60">JPG, PNG or GIF (Max 5MB)</p>
                <div>
                  <label className="block text-sm font-medium mb-2">Or paste image URL</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={profile.avatar_url}
                    onChange={(e) => {
                      setProfile((prev) => ({ ...prev, avatar_url: e.target.value }))
                      setImagePreview(e.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input name="name" value={profile.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input name="email" type="email" value={profile.email} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input name="title" value={profile.title} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <Textarea name="bio" value={profile.bio} onChange={handleChange} rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input name="phone" value={profile.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input name="location" value={profile.location} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <Input name="github_url" value={profile.github_url} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <Input name="linkedin_url" value={profile.linkedin_url} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Twitter URL</label>
            <Input name="twitter_url" value={profile.twitter_url} onChange={handleChange} />
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
