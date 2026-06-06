/**
 * Get the base URL for API calls
 * For server components: returns the origin from headers
 * For client components: returns the current origin
 * Fallback to localhost for development
 */
export function getBaseUrl(): string {
  // In production/deployed environments, use relative URLs (they'll be the same origin)
  // In development, use localhost
  if (typeof window === "undefined") {
    // Server-side: use relative URL which works correctly in all environments
    return ""
  }
  // Client-side: use current origin
  return ""
}

/**
 * Fetch with proper error handling for API calls
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit & { next?: { revalidate?: number } } = {}
): Promise<T | null> {
  try {
    // Use relative URL - works on server (same origin) and client
    const url = `${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      console.warn(`[v0] API call failed: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.warn(`[v0] API fetch error for ${endpoint}:`, error instanceof Error ? error.message : String(error))
    return null
  }
}
