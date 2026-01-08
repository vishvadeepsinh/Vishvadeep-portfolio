"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase-browser"

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, label: "At least 8 characters" },
  { regex: /[A-Z]/, label: "One uppercase letter" },
  { regex: /[a-z]/, label: "One lowercase letter" },
  { regex: /[0-9]/, label: "One number" },
  { regex: /[^A-Za-z0-9]/, label: "One special character" },
]

function UpdatePasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isValidToken, setIsValidToken] = useState(true)
  const [tokenError, setTokenError] = useState("")

  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    feedback: string[]
  }>({ score: 0, feedback: [] })

  useEffect(() => {
    const checkToken = async () => {
      const error = searchParams.get("error")
      const errorDescription = searchParams.get("error_description")

      if (error) {
        setIsValidToken(false)
        setTokenError(errorDescription || "Invalid or expired reset link")
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setIsValidToken(false)
          setTokenError("Invalid or expired reset link. Please request a new one.")
        }
      }
    }

    checkToken()
  }, [searchParams, supabase.auth])

  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, feedback: [] })
      return
    }

    const passedRequirements = PASSWORD_REQUIREMENTS.filter((req) => req.regex.test(password))

    const failedRequirements = PASSWORD_REQUIREMENTS.filter((req) => !req.regex.test(password)).map((req) => req.label)

    setPasswordStrength({
      score: passedRequirements.length,
      feedback: failedRequirements,
    })
  }, [password])

  const validatePassword = (): boolean => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
      return false
    }

    if (passwordStrength.score < PASSWORD_REQUIREMENTS.length) {
      setError("Password does not meet all requirements")
      return false
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validatePassword()) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setIsSuccess(true)

      localStorage.removeItem("passwordResetAttempts")
      localStorage.removeItem("passwordResetTimestamp")

      setTimeout(() => router.push("/admin/login"), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md p-8 border-border bg-card shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
            <p className="text-muted-foreground">{tokenError}</p>
            <div className="pt-4 space-y-2">
              <Button className="w-full" onClick={() => router.push("/admin/forgot-password")}>
                Request New Reset Link
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/admin/login")}>
                Back to Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md p-8 border-border bg-card shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="p-3 bg-primary/10 rounded-full ring-8 ring-primary/5">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Set New Password</h1>
          <p className="text-muted-foreground">Create a strong, secure password for your account</p>
        </div>

        {isSuccess ? (
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold">Password updated successfully!</p>
              <p className="text-sm opacity-80 mt-1">Redirecting to login...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-muted/50 h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded transition-colors ${
                            level <= passwordStrength.score
                              ? passwordStrength.score <= 2
                                ? "bg-red-500"
                                : passwordStrength.score <= 4
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className="font-semibold">Password must include:</p>
                        {passwordStrength.feedback.map((feedback, i) => (
                          <p key={i} className="flex items-center gap-1">
                            <span className="text-destructive">•</span> {feedback}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-muted/50 h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      password === confirmPassword ? "text-green-600" : "text-destructive"
                    }`}
                  >
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" /> Passwords do not match
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded flex items-start gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={
                isLoading || passwordStrength.score < PASSWORD_REQUIREMENTS.length || password !== confirmPassword
              }
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={null}>
      <UpdatePasswordForm />
    </Suspense>
  )
}
