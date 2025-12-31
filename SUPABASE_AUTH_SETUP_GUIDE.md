# Supabase Auth Configuration Guide

## Password Reset Email Not Received?

If you're not receiving password reset emails, follow these steps to configure Supabase Auth properly:

### 1. Configure Redirect URLs in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your application URLs to **Redirect URLs**:
   ```
   http://localhost:3000/admin/update-password
   https://yourdomain.com/admin/update-password
   ```
4. Set the **Site URL** to your main application URL:
   ```
   http://localhost:3000 (for development)
   https://yourdomain.com (for production)
   ```

### 2. Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. Ensure the template is enabled
4. The template should include: `{{ .ConfirmationURL }}`
5. Click **Save**

### 3. Configure SMTP Settings (Optional)

By default, Supabase uses its built-in email service. For production, configure custom SMTP:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your SMTP provider details:
   - **Host**: Your SMTP server
   - **Port**: Usually 587 for TLS or 465 for SSL
   - **Username**: Your SMTP username
   - **Password**: Your SMTP password
   - **Sender email**: The "from" email address
   - **Sender name**: Display name for emails

### 4. Test the Flow

1. Go to `/admin/forgot-password`
2. Enter your registered email address
3. Click "Send Reset Link"
4. Check your email inbox (and spam folder)
5. Click the link in the email
6. You should be redirected to `/admin/update-password`

### 5. Troubleshooting

**Email not received?**
- Check your spam/junk folder
- Verify the email address is registered in your Supabase auth users
- Check Supabase logs: **Authentication** → **Logs**
- Ensure your redirect URLs are whitelisted

**Reset link expired?**
- Reset links expire after 1 hour by default
- Request a new reset link

**Reset link doesn't work?**
- Verify the URL in the email matches your allowed redirect URLs
- Check that your proxy.ts allows access to `/admin/update-password`

### 6. Environment Variables

Ensure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/admin/update-password
```

### 7. Create a Test User

To test password reset, you need a registered user:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Click **Create user**
5. Now you can test password reset with this email

## Common Issues

### Issue: "Invalid or expired reset link"
**Solution**: The token in the URL has expired or is invalid. Request a new reset link.

### Issue: No email received after 5 minutes
**Solution**: 
1. Check Supabase Auth logs for errors
2. Verify SMTP configuration
3. Ensure the user exists in Supabase Auth
4. Check that emails aren't being blocked by your email provider

### Issue: "Too many attempts"
**Solution**: Wait 60 seconds before trying again. This is a security feature to prevent abuse.

## Security Best Practices

1. **Use custom SMTP** in production for better deliverability
2. **Set appropriate token expiry** times (default: 1 hour)
3. **Enable rate limiting** to prevent abuse (already implemented in code)
4. **Use HTTPS** in production for all redirect URLs
5. **Monitor auth logs** regularly for suspicious activity
6. **Implement email verification** for new user signups

## Need Help?

If you're still having issues:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Review Supabase Auth logs in your dashboard
3. Test with a different email provider
4. Contact Supabase support if using custom SMTP
