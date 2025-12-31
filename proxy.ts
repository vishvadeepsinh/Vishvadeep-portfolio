import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase-proxy"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const publicAdminPaths = ["/admin/login", "/admin/forgot-password", "/admin/update-password"]

  if (pathname.startsWith("/admin")) {
    const { supabaseResponse, user } = await updateSession(request)

    if (publicAdminPaths.includes(pathname)) {
      return supabaseResponse
    }

    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
