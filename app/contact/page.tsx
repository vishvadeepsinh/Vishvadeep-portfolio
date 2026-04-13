"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission (in a static site, form data would be handled externally)
    setTimeout(() => {
      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus("idle"), 3000)
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-foreground/70">
              Have a project in mind or want to collaborate? I'd love to hear from you. Feel free to reach out!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6">
              <Mail className="text-primary mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <a
                href="mailto:vishvadeepsinh3301@gmail.com"
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                vishvadeepsinh3301@gmail.com
              </a>
            </Card>
            <Card className="p-6">
              <Phone className="text-primary mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <a href="tel:+916377646514" className="text-foreground/70 hover:text-foreground transition-colors">
                +91 6377646514
              </a>
            </Card>
            <Card className="p-6">
              <MapPin className="text-primary mb-4" size={32} />
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-foreground/70">Ahmedabad, Gujarat, India</p>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Send Me a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows={6}
                  required
                />
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                  Failed to send message. Please try again.
                </div>
              )}

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
