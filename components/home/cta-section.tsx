import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Work Together?</h2>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
          I'm always interested in hearing about new projects and opportunities.
        </p>
        <Link href="/contact">
          <Button size="lg">
            Start a Conversation
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </Link>
      </div>
    </section>
  )
}
