"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

interface NavLink {
  href: string
  label: string
}

interface NavbarClientProps {
  navLinks: NavLink[]
}

export function NavbarClient({ navLinks }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden pb-4 space-y-2 absolute top-16 left-0 right-0 bg-background border-b border-border">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
