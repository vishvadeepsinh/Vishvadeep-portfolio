import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Global cache for Supabase browser client (singleton pattern)
let cachedClient: ReturnType<typeof createBrowserClient> | null = null
let cacheInitialized = false

// Browser client for client-side operations only - cached to prevent duplicate instances
export function createClient() {
  // Return mock if not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    if (!cacheInitialized) {
      console.warn("[v0] Supabase environment variables not configured")
      cacheInitialized = true
    }
    return {
      auth: {
        signInWithPassword: async () => ({
          data: null,
          error: new Error(
            "Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
          ),
        }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
    } as any
  }

  // Create and cache the Supabase browser client only once per browser session
  if (cachedClient === null) {
    cachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return cachedClient
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}
