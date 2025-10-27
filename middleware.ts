import { type NextRequest, NextResponse } from "next/server"
import { createServerClientInstance } from "@/lib/supabase-server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    try {
      const supabase = await createServerClientInstance()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    } catch (error) {
      console.warn("[v0] Supabase not configured, redirecting to login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
