# Portfolio Setup Instructions

## Critical Issue Resolved

Your portfolio was not saving changes because of a **database schema mismatch**. The database used UUID IDs, but the code expected INTEGER IDs.

## Step 1: Run the Migration Script

**IMPORTANT:** You MUST run this script in your Supabase SQL Editor to fix the database schema.

1. Go to your Supabase Dashboard → SQL Editor
2. Copy the entire contents of `/scripts/04-fix-all-schema-issues.sql`
3. Paste and click **Run**
4. This will recreate all tables with the correct schema and seed your profile data

## Step 2: Verify Environment Variables

Make sure these are set in the **Vars** section:

### Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### Optional (for email notifications):
- `GMAIL_USER` - Your Gmail address
- `GMAIL_APP_PASSWORD` - Gmail app-specific password

## Step 3: Test the Admin Panel

1. Go to `/admin/login`
2. Click "Preview Admin Dashboard (Demo)" to bypass authentication
3. Try adding/editing/deleting items in each section:
   - Profile (including image upload)
   - Projects
   - Skills
   - Experience
   - Contact Info
   - Messages

## Step 4: Verify Frontend Display

After making changes in the admin panel, check these pages:
- `/` - Homepage (should show your profile with image)
- `/projects` - Projects page (should show your projects)
- `/skills` - Skills page (should show all skills by category)
- `/experience` - Experience page (should show your work history)

## What Was Fixed

### 1. Database Schema
- Changed all table IDs from UUID to INTEGER/SERIAL
- Profile and Contact tables use single row with ID=1
- Projects, Skills, Experience, Messages use auto-incrementing IDs

### 2. RLS Policies
- Public read access to all tables
- Unrestricted write access (no authentication required for personal portfolio)

### 3. API Routes
- All routes now properly handle INTEGER IDs
- Upsert operations work correctly
- Proper error handling and logging

### 4. Frontend Pages
- All pages fetch data from Supabase
- Loading states with skeletons
- Error handling and empty states

## Troubleshooting

### Changes not appearing?
1. Check browser console for errors (F12 → Console tab)
2. Look for `[v0]` prefixed log messages
3. Verify the migration script ran successfully
4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Image not uploading?
1. Check that the image is under 5MB
2. Verify it's JPG, PNG, or GIF format
3. Check console for upload errors
4. The image is stored as base64 in the database

### API errors?
1. Verify environment variables are set
2. Check Supabase dashboard for connection issues
3. Look at the Network tab in DevTools for failed requests

## Next Steps

1. Run the migration script
2. Upload your profile image
3. Add your projects, skills, and experience
4. Deploy to Vercel
5. Share your portfolio!

## Support

If issues persist after running the migration:
1. Check the browser console for `[v0]` log messages
2. Verify all environment variables are set
3. Ensure the migration script completed without errors
