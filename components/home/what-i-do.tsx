import { Code2, Palette, BarChart3 } from "lucide-react"

export default function WhatIDo() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">What I Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <Code2 className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Full-Stack Development</h3>
            <p className="text-foreground/70">
              Building scalable web applications with Python/Django, Node.js, React, and modern databases.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <Palette className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">UI/UX Design</h3>
            <p className="text-foreground/70">
              Creating intuitive and beautiful user interfaces with Figma, focusing on user experience.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <BarChart3 className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Data Analysis</h3>
            <p className="text-foreground/70">
              Deriving insights from data using Tableau, Power BI, and Python for data-driven decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
