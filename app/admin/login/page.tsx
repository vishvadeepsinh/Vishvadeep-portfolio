"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { createClient, isSupabaseConfigured } from "@/lib/supabase-browser"
import { ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!isConfigured) {
        setError("Supabase is not configured. Please set up environment variables first.")
        return
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      router.push("/admin")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md p-8 border-border bg-card shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="p-3 bg-primary/10 rounded-full ring-8 ring-primary/5">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Sign in to manage your portfolio</p>
        </div>

        {!isConfigured && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Setup Required</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              Supabase is not configured yet. To enable authentication:
            </p>
            <ol className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
              <li>Click Connect in the sidebar and add Supabase</li>
              <li>Add environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>Create a user in Supabase Authentication</li>
            </ol>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portfolio.com"
              required
              disabled={!isConfigured}
              className="bg-muted/50 h-11"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <Link href="/admin/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={!isConfigured}
              className="bg-muted/50 h-11"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200 text-sm">
              <p className="font-semibold mb-1">Error</p>
              <p className="text-xs">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading || !isConfigured}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to portfolio
          </Link>
        </div>
      </Card>
    </div>
  )
}
