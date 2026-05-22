import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let cachedClient: ReturnType<typeof createBrowserClient> | null = null

// Browser client for client-side operations only - cached to prevent duplicate instances
export function createClient() {
  // Return a mock client if environment variables are not set
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not configured")
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

  // Return cached client instance to prevent multiple GoTrueClient instances
  if (!cachedClient) {
    cachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return cachedClient
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}
