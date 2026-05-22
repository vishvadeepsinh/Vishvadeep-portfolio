"use client"

import { useState, useEffect, useCallback } from "react"
import { dataCache } from "@/lib/data-cache"

interface UseCachedFetchOptions {
  cacheKey: string
  cacheTTL?: number
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useCachedFetch<T>(url: string, options: UseCachedFetchOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { cacheKey, cacheTTL = 60000, onSuccess, onError } = options

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = dataCache.get<T>(cacheKey)
    if (cached) {
      console.log(`[Cache] Hit for ${cacheKey}`)
      setData(cached)
      setLoading(false)
      return
    }

    console.log(`[Cache] Miss for ${cacheKey}`)

    try {
      const response = await fetch(url)
      const result = await response.json()

      const fetchedData = result.data || result
      setData(fetchedData)
      dataCache.set(cacheKey, fetchedData, cacheTTL)

      if (onSuccess) onSuccess(fetchedData)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch data")
      setError(error)
      if (onError) onError(error)
      console.error(`[Fetch Error] ${cacheKey}:`, error)
    } finally {
      setLoading(false)
    }
  }, [url, cacheKey, cacheTTL, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    dataCache.clear()
    setLoading(true)
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}
