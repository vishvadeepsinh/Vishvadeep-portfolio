import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  return createClient(supabaseUrl, supabaseKey)
}

const FALLBACK_PROFILE = {
  id: 1,
  name: "Vishvadeepsinh Chudasama",
  title: "Python Developer | Full-Stack Developer | UI/UX Designer | Data Analyst",
  bio: "Versatile tech professional with 1.5+ years of experience in Python/Django development, full-stack engineering, UI/UX design, and data analysis.",
  email: "vishvadeepsinh3301@gmail.com",
  phone: "+91 6377646514",
  location: "Ahmedabad, Gujarat, India",
  avatar_url: null,
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  twitter_url: "https://twitter.com",
  updated_at: new Date().toISOString(),
} as const

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      console.warn("[v0] Supabase not configured - cannot save profile")
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
        },
        { status: 503 },
      )
    }

    const supabase = getSupabaseClient()
    const body = await request.json()

    const avatarLength = body.avatar_url ? body.avatar_url.length : 0
    console.log("[v0] Saving profile - avatar_url length:", avatarLength)

    const { data, error } = await supabase
      .from("profile")
      .upsert({
        id: 1,
        name: body.name,
        title: body.title,
        bio: body.bio,
        email: body.email,
        phone: body.phone,
        location: body.location,
        avatar_url: body.avatar_url || null,
        github_url: body.github_url,
        linkedin_url: body.linkedin_url,
        twitter_url: body.twitter_url,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] Profile saved - returned avatar_url length:", data?.[0]?.avatar_url?.length || 0)
    return NextResponse.json({ success: true, data: data?.[0] || data })
  } catch (error) {
    console.error("[v0] Profile save error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

export async function GET() {
  try {
    console.log("[v0] GET /api/admin/profile called")
    
    if (!isSupabaseConfigured()) {
      console.warn("[v0] Supabase not configured - returning fallback profile")
      const response = { success: true, data: FALLBACK_PROFILE }
      console.log("[v0] Returning fallback response")
      return NextResponse.json(response)
    }

    const supabase = getSupabaseClient()
    console.log("[v0] Fetching profile from Supabase")

    const { data, error } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle()

    if (error) {
      console.error("[v0] Supabase fetch error:", error.message)
      // We still return success: true with fallback data to prevent app crash
      const response = { success: true, data: FALLBACK_PROFILE }
      return NextResponse.json(response)
    }

    console.log("[v0] Profile fetched - avatar_url present:", !!data?.avatar_url)
    const response = { success: true, data: data || FALLBACK_PROFILE }
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Profile fetch error:", error instanceof Error ? error.message : String(error))
    // Always return JSON even on failure
    const response = { success: true, data: FALLBACK_PROFILE }
    return NextResponse.json(response)
  }
}
