"use client"

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL = 60000 // 60 seconds

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const now = Date.now()
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const now = Date.now()
    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  clear(): void {
    this.cache.clear()
  }

  clearExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

export const dataCache = new DataCache()

// Auto-clear expired entries every 5 minutes
if (typeof window !== "undefined") {
  setInterval(() => {
    dataCache.clearExpired()
  }, 300000)
}
