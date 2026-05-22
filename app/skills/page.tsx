import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

interface Skill {
  id: number
  name: string
  category: string
  proficiency: number
}

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

async function getSkills(): Promise<Skill[]> {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/admin/skills`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error("[v0] Failed to fetch skills:", error)
    return []
  }
}

function groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )
}

export default async function SkillsPage() {
  const skills = await getSkills()
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

          {Object.keys(skillsByCategory).length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-foreground/60">No skills found. Add some from the admin dashboard!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <Card key={category} className="p-6">
                  <h2 className="text-xl font-semibold mb-6">{category}</h2>
                  <div>
                    {categorySkills.map((skill) => (
                      <SkillBar key={skill.id} name={skill.name} proficiency={skill.proficiency} />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
