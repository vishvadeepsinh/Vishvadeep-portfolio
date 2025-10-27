# Deployment Guide

## Prerequisites

- Supabase account (https://supabase.com)
- Vercel account (https://vercel.com)
- GitHub account (https://github.com)
- Gmail account with 2FA enabled

## Step 1: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to **SQL Editor** and run the scripts:
   - First: `scripts/01-init-schema.sql`
   - Then: `scripts/02-seed-data.sql`
3. Set up authentication:
   - Go to **Authentication > Providers**
   - Enable Email provider
   - Go to **Authentication > URL Configuration**
   - Add your Vercel domain (you'll get this after deployment)
4. Get your credentials:
   - Go to **Settings > API**
   - Copy `Project URL` and `anon public key`

## Step 2: Set Up Gmail for Email Notifications

1. Enable 2-Factor Authentication on your Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the generated 16-character password

## Step 3: Deploy to Vercel

1. Push your code to GitHub:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   \`\`\`

2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `GMAIL_USER` = Your Gmail address
   - `GMAIL_APP_PASSWORD` = Your Gmail app password
5. Click **Deploy**

## Step 4: Update Supabase Redirect URLs

After deployment, update your Supabase settings:

1. Go to Supabase > Authentication > URL Configuration
2. Add your Vercel domain to "Redirect URLs":
   - `https://your-domain.vercel.app/admin/login`
   - `https://your-domain.vercel.app/admin`

## Step 5: Create Admin User

1. Go to Supabase > Authentication > Users
2. Click "Invite" and send yourself an invitation
3. Or use the Supabase CLI to create a user:
   \`\`\`bash
   npx supabase auth admin create-user --email your@email.com --password your_password
   \`\`\`

## Verification Checklist

- [ ] Supabase project created and configured
- [ ] Database tables created with SQL scripts
- [ ] Gmail app password generated
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] Supabase redirect URLs updated
- [ ] Admin user created
- [ ] Can login to admin dashboard
- [ ] Contact form sends emails
- [ ] Portfolio pages display correctly

## Troubleshooting

**"Invalid login credentials" error:**
- Verify your Supabase credentials in environment variables
- Check that admin user exists in Supabase > Authentication > Users

**Contact form not sending emails:**
- Verify GMAIL_USER and GMAIL_APP_PASSWORD are correct
- Check Gmail app password (not your regular password)
- Verify 2FA is enabled on your Google Account

**Pages not loading:**
- Check Supabase connection in browser console
- Verify environment variables are set in Vercel
- Check Supabase project is active

**Database errors:**
- Verify SQL scripts were run in correct order
- Check RLS policies are enabled
- Verify tables exist in Supabase > Table Editor

## Custom Domain

To use a custom domain:

1. Go to Vercel > Project Settings > Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update Supabase redirect URLs with your custom domain

## Monitoring

- Monitor Vercel deployments at https://vercel.com/dashboard
- Check Supabase logs at Supabase > Logs
- Monitor email delivery in Gmail
- Check error logs in Vercel > Functions

## Support

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
\`\`\`

```env.example file=".env.example"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Gmail Configuration (for contact form emails)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
