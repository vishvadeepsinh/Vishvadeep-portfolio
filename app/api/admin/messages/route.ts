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

// GET - Fetch all messages
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

    if (error) throw error

    console.log("[v0] Messages fetched:", data?.length || 0)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Messages fetch error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// PATCH - Mark message as read
export async function PATCH(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
    }

    const { id } = await request.json()
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from("messages").update({ read: true }).eq("id", id).select().single()

    if (error) throw error

    console.log("[v0] Message marked as read:", id)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Message update error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

// DELETE - Delete message
export async function DELETE(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Supabase not configured" }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Message ID required" }, { status: 400 })
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.from("messages").delete().eq("id", id)

    if (error) throw error

    console.log("[v0] Message deleted:", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Message delete error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
