"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase-browser"

// Added rate limiting to prevent abuse
const RATE_LIMIT_DURATION = 60000 // 1 minute
const MAX_ATTEMPTS = 3

export default function ForgotPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState("")

  // Added rate limiting state
  const [attemptCount, setAttemptCount] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [rateLimitEnd, setRateLimitEnd] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState(0)

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Rate limiting effect
  useEffect(() => {
    const storedAttempts = localStorage.getItem("passwordResetAttempts")
    const storedTimestamp = localStorage.getItem("passwordResetTimestamp")

    if (storedAttempts && storedTimestamp) {
      const attempts = Number.parseInt(storedAttempts)
      const timestamp = Number.parseInt(storedTimestamp)
      const now = Date.now()

      if (now - timestamp < RATE_LIMIT_DURATION) {
        if (attempts >= MAX_ATTEMPTS) {
          setIsRateLimited(true)
          setRateLimitEnd(timestamp + RATE_LIMIT_DURATION)
        }
        setAttemptCount(attempts)
      } else {
        // Reset if time has passed
        localStorage.removeItem("passwordResetAttempts")
        localStorage.removeItem("passwordResetTimestamp")
      }
    }
  }, [])

  // Countdown timer for rate limit
  useEffect(() => {
    if (!isRateLimited || !rateLimitEnd) return

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.ceil((rateLimitEnd - now) / 1000)

      if (remaining <= 0) {
        setIsRateLimited(false)
        setAttemptCount(0)
        setRateLimitEnd(null)
        localStorage.removeItem("passwordResetAttempts")
        localStorage.removeItem("passwordResetTimestamp")
      } else {
        setRemainingTime(remaining)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isRateLimited, rateLimitEnd])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (isRateLimited) {
      setError(`Too many attempts. Please try again in ${remainingTime} seconds.`)
      return
    }

    setIsLoading(true)

    try {
      const newAttemptCount = attemptCount + 1
      setAttemptCount(newAttemptCount)
      localStorage.setItem("passwordResetAttempts", newAttemptCount.toString())
      localStorage.setItem("passwordResetTimestamp", Date.now().toString())

      if (newAttemptCount >= MAX_ATTEMPTS) {
        setIsRateLimited(true)
        setRateLimitEnd(Date.now() + RATE_LIMIT_DURATION)
        throw new Error("Too many attempts. Please try again later.")
      }

      const redirectUrl = `${
        typeof window !== "undefined" ? window.location.origin : "https://vishvadeepsinh.vercel.app"
      }/auth/callback`

      console.log("[v0] Sending password reset email to:", email)
      console.log("[v0] Redirect URL:", redirectUrl)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        console.error("[v0] Password reset error:", error)
        throw error
      }

      console.log("[v0] Password reset email sent successfully")
      localStorage.removeItem("passwordResetAttempts")
      localStorage.removeItem("passwordResetTimestamp")
      setAttemptCount(0)
      setIsSent(true)
    } catch (err) {
      console.error("[v0] Password reset error:", err)
      setError(err instanceof Error ? err.message : "Failed to send reset link")
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Reset Password</h1>
          <p className="text-muted-foreground">We'll send you a secure link to reset your password</p>
        </div>

        {isSent ? (
          <div className="text-center space-y-6">
            {/* Enhanced success message with icon */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-semibold">Reset link sent!</p>
              </div>
              <p className="text-sm opacity-80">Please check your inbox at</p>
              <p className="font-mono text-sm mt-1">{email}</p>
              <p className="text-xs opacity-70 mt-3">The link will expire in 1 hour for security purposes.</p>
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/admin/login")}>
              Return to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Added rate limit warning */}
            {isRateLimited && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded flex items-start gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Rate limit exceeded</p>
                  <p className="text-xs mt-1">Please wait {remainingTime} seconds before trying again.</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.com"
                required
                disabled={isRateLimited}
                className="bg-muted/50 border-border focus:ring-primary h-11"
              />
              {/* Added attempt counter display */}
              {attemptCount > 0 && attemptCount < MAX_ATTEMPTS && (
                <p className="text-xs text-muted-foreground">Attempts remaining: {MAX_ATTEMPTS - attemptCount}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded flex items-start gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Added security notice */}
            <div className="p-3 bg-muted/50 border border-border rounded text-xs text-muted-foreground">
              <p className="flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3 h-3" />
                <span className="font-semibold">Security Notice</span>
              </p>
              <p>
                For your security, we'll send a one-time reset link to your email. This link will expire after 1 hour.
              </p>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading || isRateLimited}>
              {isLoading ? "Sending link..." : "Send Reset Link"}
            </Button>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
