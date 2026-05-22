import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  return createClient(supabaseUrl, supabaseKey)
}

const FALLBACK_ABOUT = {
  id: 1,
  title: "About Me",
  intro: "I'm Vishvadeepsinh Chudasama, a versatile tech professional.",
  description: "My journey in tech started with a strong foundation in programming.",
  location: "Ahmedabad, Gujarat, India",
  experience_years: "1.5+ Years",
  education: "Bachelor of Engineering (B.E.) from Silver Oak University",
  languages: ["English", "Hindi", "Gujarati"],
  what_drives_me: ["Building scalable applications", "Creating beautiful user interfaces", "Mentoring developers"],
  quick_facts: {
    graduation_year: "2024",
    university: "Silver Oak University",
    cgpa: "7.78/10.0",
  },
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, data: FALLBACK_ABOUT })
    }

    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("about").select("*").eq("id", 1).single()

    if (error) {
      console.error("[v0] About fetch error:", error)
      return NextResponse.json({
        success: true,
        data: FALLBACK_ABOUT,
        error: "Using fallback data",
      })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] About API error:", error)
    return NextResponse.json({
      success: true,
      data: FALLBACK_ABOUT,
      error: error.message,
    })
  }
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
    }

    const body = await request.json()
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("about")
      .upsert({ ...body, id: 1, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) {
      console.error("[v0] About save error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] About API error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
