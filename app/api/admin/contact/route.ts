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

// GET - Fetch contact info
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: {
          id: 1,
          email: "vishvadeepsinh3301@gmail.com",
          phone: "+91 6377646514",
          address: "Ahmedabad, Gujarat, India",
        },
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("contact").select("*").eq("id", 1).single()

    if (error) throw error

    console.log("[v0] Contact fetched successfully")
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Contact fetch error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// PUT - Update contact info
export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
    }

    const body = await request.json()
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from("contact")
      .upsert({ id: 1, ...body })
      .select()
      .single()

    if (error) throw error

    console.log("[v0] Contact updated successfully")
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Contact update error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
