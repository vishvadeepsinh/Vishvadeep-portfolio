import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { STATIC_ABOUT, STATIC_PROFILE } from "@/lib/static-data/profile"

export default function AboutPage() {
  const about = STATIC_ABOUT
  const profile = STATIC_PROFILE

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{about.heading}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Who I Am</h2>
              <p className="text-foreground/70">{about.content}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-foreground/60">Location</p>
                  <p className="font-medium">{profile.location}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
            </Card>
          </div>

          {about.key_highlights && about.key_highlights.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">Key Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {about.key_highlights.map((highlight, idx) => (
                  <Card key={idx} className="p-6">
                    <p className="text-foreground/70">{highlight}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
                  </div>
                </Card>
              </div>

              {about?.what_drives_me && about.what_drives_me.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">What Drives Me</h2>
                  <ul className="space-y-3 text-foreground/70">
                    {about.what_drives_me.map((item: string, index: number) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-primary">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
