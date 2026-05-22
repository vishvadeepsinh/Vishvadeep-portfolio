"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-browser"
import { toast } from "sonner"

const adminLinks = [
  { href: "/admin", label: "Profile", icon: "👤" },
  { href: "/admin/projects", label: "Projects", icon: "📦" },
  { href: "/admin/skills", label: "Skills", icon: "🎯" },
  { href: "/admin/experience", label: "Experience", icon: "💼" },
  { href: "/admin/about", label: "About", icon: "📝" },
  { href: "/admin/contact", label: "Contact Info", icon: "📧" },
  { href: "/admin/messages", label: "Messages", icon: "💬" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast.success("Logged out successfully")
      router.push("/admin/login")
    } catch (error) {
      console.error("[v0] Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } border-r border-border bg-card transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg text-primary">Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
                title={!sidebarOpen ? link.label : undefined}
              >
                <span className="text-xl">{link.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            {sidebarOpen && "Logout"}
          </Button>

          <Link href="/">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Home size={16} className="mr-2" />
              {sidebarOpen && "Back to Site"}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
