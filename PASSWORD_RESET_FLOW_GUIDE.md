# Comprehensive Password Reset Flow Guide

## Overview

This guide documents the secure password reset flow implementation for the admin authentication system using Supabase Auth (third-party authentication service).

## Architecture Diagram

```
User clicks "Forgot Password"
    ↓
ForgotPasswordPage (/admin/forgot-password)
    ↓
Enter Email & Validate
    ↓
Rate Limiting Check (Max 3 attempts per minute)
    ↓
supabase.auth.resetPasswordForEmail(email, {redirectTo: "/auth/callback"})
    ↓
Supabase generates recovery token
    ↓
Email sent with reset link containing token & type=recovery
    ↓
User clicks email link
    ↓
Supabase verifies token (1-hour expiration)
    ↓
Auth callback route exchanges code for session (/auth/callback)
    ↓
Detects type=recovery parameter
    ↓
Redirects to /admin/update-password with active session
    ↓
UpdatePasswordPage validates session & displays form
    ↓
User enters new password (must meet requirements)
    ↓
supabase.auth.updateUser({ password })
    ↓
Password updated in Supabase (old passwords invalidated)
    ↓
Success confirmation
    ↓
Redirect to /admin/login
```

## Step-by-Step Flow

### 1. Forgot Password Request

**File:** `app/admin/forgot-password/page.tsx`

**Process:**
- User enters email address
- Email validation (regex check)
- Rate limiting enforced (3 attempts per 60 seconds)
- Email stored in localStorage for abuse prevention
- Supabase Auth API: `resetPasswordForEmail(email, { redirectTo: "/auth/callback" })`

**Security Features:**
- Client-side rate limiting to prevent brute force
- Email format validation
- Attempt counter stored in localStorage
- Clear user feedback on rate limit status

**Important:** The `redirectTo` parameter must be whitelisted in Supabase dashboard under:
- Settings → Authentication → URL Configuration → Redirect URLs
- Add: `https://vishvadeepsinh.vercel.app/auth/callback` (or your production domain)

### 2. Email Link Verification

**What Happens:**
- Supabase generates a secure reset token valid for 1 hour
- Email contains link: `https://supabase-project.supabase.co/auth/v1/verify?token=<TOKEN>&type=recovery&redirect_to=<REDIRECT_URL>`
- User clicks the email link
- Supabase verifies the token (expiration check)

**Token Details:**
- Format: PKCE token
- Expiration: 1 hour from generation
- Type: recovery (indicates password reset, not email verification)
- Single use: Cannot be reused after code exchange

### 3. Auth Callback Route

**File:** `app/auth/callback/route.ts`

**Process:**
1. Receives request with `code` and `type` parameters from Supabase
2. Server-side: Creates Supabase server client
3. Exchanges authorization code for session: `supabase.auth.exchangeCodeForSession(code)`
4. Sets secure HTTP-only cookies with session
5. Checks `type` parameter:
   - If `type=recovery`: Redirect to `/admin/update-password`
   - Otherwise: Use `next` parameter or redirect to `/admin`
6. On error: Redirect to login with error message

**Security:**
- Server-side code exchange (never expose tokens to client)
- HTTP-only cookies automatically set by Supabase SDK
- Token validated and session established in same request

### 4. Update Password Page

**File:** `app/admin/update-password/page.tsx`

**Process:**
1. Page loads with user session from cookie
2. Validates session exists (checks `useSearchParams` for errors)
3. Checks for error parameters (invalid/expired link)
4. Displays password update form with requirements:
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 lowercase letter
   - At least 1 number
   - At least 1 special character
5. Real-time password strength indicator
6. Confirm password validation
7. On submit: `supabase.auth.updateUser({ password })`
8. Success: Redirect to login after 3 seconds

**Security Features:**
- Session validation at page load
- Password strength requirements enforced
- Password visibility toggle
- Real-time validation feedback
- Clear error messages

## Troubleshooting Guide

### Issue 1: Reset link not received in email

**Symptoms:**
- User clicks "Send Reset Link" but doesn't receive email
- No error message shown

**Debugging Steps:**

1. **Check Supabase Email Configuration**
   - Go to Supabase Dashboard → Authentication → Email Templates
   - Verify "Reset Password" template is enabled
   - Check email template has correct content

2. **Verify Redirect URL is Whitelisted**
   ```sql
   -- Check your Supabase project configuration
   -- Dashboard → Settings → Authentication → URL Configuration
   ```
   - Must include: `https://vishvadeepsinh.vercel.app/auth/callback`
   - For development: `http://localhost:3000/auth/callback`

3. **Check Rate Limiting (Client-side)**
   - Open browser DevTools → Application → LocalStorage
   - Look for `passwordResetAttempts` and `passwordResetTimestamp`
   - If attempting > 3 times in 60 seconds, requests are blocked locally
   - Clear localStorage: `localStorage.clear()` and try again

4. **Test with SQL Query**
   ```sql
   -- Check if user exists in auth.users table
   SELECT id, email, created_at FROM auth.users WHERE email = 'your-email@example.com';
   
   -- Check for any auth logs (if available in your Supabase plan)
   SELECT * FROM auth.audit_log_entries WHERE created_at > now() - interval '5 minutes';
   ```

5. **Check Email Provider (if using custom SMTP)**
   - Dashboard → Settings → Email Templates
   - Verify SMTP credentials are correct
   - Check email provider's bouncing/spam filters

### Issue 2: Reset link received but doesn't redirect to update password page

**Symptoms:**
- Email link opens a Supabase verification page
- Page doesn't redirect to `/admin/update-password`
- Shows error or stays on verification page

**Debugging Steps:**

1. **Verify Callback Route Exists**
   ```bash
   # Check file exists
   ls -la app/auth/callback/route.ts
   ```
   - Route must be at: `app/auth/callback/route.ts`
   - Not `app/api/auth/callback/route.ts`

2. **Check Type Parameter Passed**
   - Email link URL should contain: `type=recovery`
   - Example: `https://supabase-project.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=...`
   - If missing `type=recovery`, it's a configuration issue in Supabase

3. **Verify Redirect URL in Email Config**
   - Dashboard → Authentication → Email Templates → Reset Password
   - Check the template contains: `{{ .ConfirmationURL }}`
   - The redirect_to parameter should be set correctly

4. **Test Callback Route Directly**
   ```bash
   # Simulate the callback with a test (requires valid token)
   curl "http://localhost:3000/auth/callback?code=test_code&type=recovery"
   ```

### Issue 3: Update password page shows "Invalid or expired reset link"

**Symptoms:**
- Redirects to update password page
- Displays error: "Invalid or expired reset link"
- Cannot update password

**Debugging Steps:**

1. **Check Token Expiration**
   - Reset links expire after 1 hour
   - Resend email if more than 1 hour has passed
   - Token can only be used once

2. **Verify Session Created Successfully**
   - Open browser DevTools → Application → Cookies
   - Look for: `sb-<project-id>-auth-token`
   - Should contain user session
   - If missing, callback route didn't set cookies

3. **Check Browser Cookie Settings**
   - Ensure cookies are enabled
   - Check for third-party cookie restrictions
   - Clear cookies and try again: Delete all `sb-` prefixed cookies

4. **Review Callback Route Logs**
   - Add logging to `app/auth/callback/route.ts`:
   ```typescript
   const { error } = await supabase.auth.exchangeCodeForSession(code)
   console.log("[v0] Code exchange result:", { error, code, type })
   ```

5. **Verify Supabase Credentials**
   ```bash
   # Check that environment variables are set correctly
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

### Issue 4: Password update fails despite correct entry

**Symptoms:**
- All password requirements met
- Form shows "Password updated successfully"
- But password doesn't actually change
- User cannot login with new password

**Debugging Steps:**

1. **Verify updateUser Permission**
   - User must have active session (from code exchange)
   - Session must be authenticated (not anonymous)
   - Check Supabase RLS policies don't block updates

2. **Check Password Requirements Met**
   - Minimum 8 characters: ✓
   - 1 uppercase letter: ✓
   - 1 lowercase letter: ✓
   - 1 number: ✓
   - 1 special character: ✓
   - All must be satisfied

3. **Test Update Directly**
   ```typescript
   const { error } = await supabase.auth.updateUser({ 
     password: 'NewPassword123!' 
   })
   if (error) console.log("[v0] Update error:", error)
   ```

4. **Check Session Validity**
   ```typescript
   const { data: { session } } = await supabase.auth.getSession()
   console.log("[v0] Session valid:", !!session)
   ```

5. **Verify No Active Login Sessions**
   - If user is already logged in elsewhere, update might fail
   - Clear all sessions: Go to Dashboard → Authentication → Users → User Details → Sessions → Sign out all

## Security Considerations

### What Stays Secure

1. **Old Passwords**
   - NOT invalidated unless explicitly changed
   - User can revert to using old password if update fails
   - Once changed, old password cannot be used

2. **Token Security**
   - Tokens never stored client-side
   - PKCE tokens are cryptographically secure
   - 1-hour expiration prevents long-term attacks
   - Single use only

3. **Session Security**
   - Sessions use HTTP-only cookies (cannot be accessed by JavaScript)
   - CSRF tokens included automatically
   - Session validated on each request

4. **Password Storage**
   - Passwords stored as bcrypt hashes (not encrypted)
   - Hashes cannot be reversed
   - Supabase handles all encryption

### Abuse Prevention

1. **Rate Limiting**
   - Client-side: 3 attempts per 60 seconds
   - Server-side: Supabase enforces per-IP limits
   - localStorage tracks attempt count

2. **Email Validation**
   - Invalid format emails rejected
   - Non-existent emails silently ignored (no confirmation)
   - Prevents enumeration attacks

3. **Token Validation**
   - 1-hour expiration
   - Type parameter validation
   - Single-use tokens

## Testing the Flow

### Happy Path Test

1. Go to `/admin/login`
2. Click "Forgot password?"
3. Enter admin email address
4. Check inbox for reset email
5. Click reset link in email
6. Enter new password meeting all requirements
7. Click "Update Password"
8. See success message
9. Redirect to login page
10. Login with new password

### Error Case Tests

**Test Expired Link:**
1. Request reset email
2. Wait 1+ hours
3. Click reset link
4. Should show "Invalid or expired reset link"

**Test Invalid Email:**
1. Try to reset with non-existent email
2. Should show success (for security, don't reveal if email exists)
3. Check email (won't receive anything)

**Test Rate Limiting:**
1. Request reset 3+ times in 1 minute
2. On 4th attempt, show: "Too many attempts"
3. Wait 60 seconds
4. Can request again

## Configuration Checklist

- [ ] Redirect URLs configured in Supabase Dashboard
  - [ ] Production: `https://vishvadeepsinh.vercel.app/auth/callback`
  - [ ] Development: `http://localhost:3000/auth/callback`
- [ ] Email templates enabled in Supabase
  - [ ] Reset Password template exists
  - [ ] Template contains `{{ .ConfirmationURL }}`
- [ ] Callback route file exists: `app/auth/callback/route.ts`
- [ ] Forgot password page: `app/admin/forgot-password/page.tsx`
- [ ] Update password page: `app/admin/update-password/page.tsx`
- [ ] Proxy middleware allows public paths: `/admin/forgot-password`, `/admin/update-password`
- [ ] Environment variables set:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] SMTP configured (if using custom email provider)
- [ ] Email provider domain verified (if using custom SMTP)

## Monitoring & Logging

### Recommended Logging Points

```typescript
// In forgot-password page
console.log("[v0] Password reset request for:", email)
console.log("[v0] Redirect URL:", redirectUrl)

// In auth callback
console.log("[v0] Code exchange initiated for type:", type)
console.log("[v0] Code exchange success, redirecting to:", redirectPath)

// In update password
console.log("[v0] Session valid:", !!session)
console.log("[v0] Password update completed")
```

### Production Monitoring

- Monitor email delivery rates
- Track password reset request frequency
- Alert on repeated failed attempts
- Log authentication errors to error tracking service (e.g., Sentry)

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Password Reset Guide](https://supabase.com/docs/guides/auth/auth-password-reset)
- [Email Templates](https://supabase.com/docs/guides/auth/managing-user-data#email-templates)
- [HTTP-Only Cookies](https://supabase.com/docs/guides/auth/cookies)
