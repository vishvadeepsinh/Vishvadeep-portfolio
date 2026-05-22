import { createServerClientInstance } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Supabase is not configured" }, { status: 503 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    const supabase = await createServerClientInstance()
    const fileName = `profile-${Date.now()}-${file.name}`
    const buffer = await file.arrayBuffer()

    const { data, error } = await supabase.storage.from("avatars").upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    })

    if (error) {
      console.error("[v0] Storage upload error:", error)
      throw error
    }

    // Get public URL
    const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(fileName)

    console.log("[v0] Image uploaded to storage:", publicData.publicUrl)
    return NextResponse.json({ success: true, url: publicData.publicUrl })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
