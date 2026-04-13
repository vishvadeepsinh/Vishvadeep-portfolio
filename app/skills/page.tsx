import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { STATIC_SKILLS } from "@/lib/static-data/skills"

function SkillBar({ name, proficiency }: { name: string; proficiency: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-foreground/60">{proficiency}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${proficiency}%` }} />
      </div>
    </div>
  )
}

function groupSkillsByCategory(skills: typeof STATIC_SKILLS) {
  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof STATIC_SKILLS>,
  )
}

export default function SkillsPage() {
  const skills = STATIC_SKILLS
  const skillsByCategory = groupSkillsByCategory(skills)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Skills & Expertise</h1>
            <p className="text-lg text-foreground/70">
              A comprehensive overview of my technical skills and proficiency levels across various technologies, tools,
              and professional competencies.
            </p>
          </div>

          {Object.keys(skillsByCategory).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <Card key={category} className="p-6">
                  <h3 className="text-xl font-semibold mb-6 capitalize">{category}</h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <SkillBar key={skill.id} name={skill.name} proficiency={skill.proficiency} />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60">No skills data available.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
