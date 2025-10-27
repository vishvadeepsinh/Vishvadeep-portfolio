"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function AdminContactPage() {
  const [contact, setContact] = useState({
    email: "vishvadeepsinh3301@gmail.com",
    phone: "+91 6377646514",
    address: "Ahmedabad, Gujarat, India",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      const response = await fetch("/api/admin/contact")
      const result = await response.json()
      if (result.success && result.data) {
        setContact(result.data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch contact:", error)
      toast.error("Failed to load contact information")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setContact((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Contact information saved successfully!")
      } else {
        throw new Error(result.error || "Failed to save")
      }
    } catch (error) {
      console.error("[v0] Save error:", error)
      toast.error("Failed to save contact information")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Information</h1>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Information</h1>
        <p className="text-foreground/70">Update your contact details</p>
      </div>

      <Card className="p-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input name="email" type="email" value={contact.email} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input name="phone" value={contact.phone} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Input name="address" value={contact.address} onChange={handleChange} />
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={fetchContact}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
