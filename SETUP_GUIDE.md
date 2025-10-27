# Portfolio Setup Guide

This is a complete Next.js portfolio application with an admin dashboard, built with Supabase, Tailwind CSS, and modern web technologies.

## Features

- **Public Portfolio Pages**: Home, Projects, Skills, Experience, About, Contact
- **Admin Dashboard**: Manage profile, projects, skills, experience, contact info, and messages
- **Contact Form**: Collect visitor messages with email notifications
- **Responsive Design**: Mobile-first design with dark mode support
- **Database**: Supabase with Row Level Security (RLS) policies

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Gmail account (for email notifications)
- Vercel account (for deployment)

## Installation

1. **Clone or download the project**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Go to SQL Editor and run the scripts in `/scripts` folder:
     - First run: `01-init-schema.sql` (creates tables and RLS policies)
     - Then run: `02-seed-data.sql` (populates with your data)
   - Get your project URL and anon key from Settings > API

4. **Configure Environment Variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_APP_PASSWORD=your_gmail_app_password
   \`\`\`

   **Getting Gmail App Password:**
   - Enable 2-Factor Authentication on your Google Account
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Copy the generated 16-character password

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open http://localhost:3000 in your browser

## Admin Dashboard Access

1. Navigate to http://localhost:3000/admin/login
2. Enter any email and password (demo mode - implement real auth with Supabase)
3. Manage your portfolio content

## Integration Checklist

- [ ] Supabase project created and configured
- [ ] Database schema initialized with SQL scripts
- [ ] Environment variables added to `.env.local`
- [ ] Gmail app password configured
- [ ] Admin login working with Supabase auth
- [ ] Contact form sending emails
- [ ] All pages displaying correctly

## Deployment to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your_github_repo
   git push -u origin main
   \`\`\`

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click Deploy

3. **Update Supabase Settings**
   - Go to Supabase > Authentication > URL Configuration
   - Add your Vercel domain to "Redirect URLs"

## File Structure

\`\`\`
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes (contact form)
│   ├── contact/            # Contact page
│   ├── projects/           # Projects page
│   ├── skills/             # Skills page
│   ├── experience/         # Experience page
│   ├── about/              # About page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── navbar.tsx          # Navigation bar
│   ├── footer.tsx          # Footer
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── supabase-client.ts  # Supabase configuration
│   └── email-config.ts     # Email configuration
├── scripts/
│   ├── 01-init-schema.sql  # Database schema
│   └── 02-seed-data.sql    # Sample data
└── middleware.ts           # Next.js middleware for auth
\`\`\`

## Customization

### Update Your Information

1. Edit `/scripts/02-seed-data.sql` with your details
2. Re-run the seed script in Supabase SQL Editor
3. Or use the admin dashboard to update information

### Styling

- Colors are defined in `app/globals.css` using CSS variables
- Tailwind CSS is configured in `tailwind.config.ts`
- Dark mode is automatically supported

### Add More Pages

1. Create a new folder in `app/` (e.g., `app/blog/`)
2. Add `page.tsx` file
3. Update navigation in `components/navbar.tsx`

## Troubleshooting

**Contact form not sending emails:**
- Check Gmail app password is correct
- Verify GMAIL_USER environment variable is set
- Check Supabase connection in API route

**Admin dashboard not loading:**
- Verify Supabase credentials in environment variables
- Check database tables exist (run SQL scripts)
- Clear browser cache and try again

**Styling issues:**
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run dev`

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Create an issue on GitHub

## License

This project is open source and available under the MIT License.
\`\`\`

\`\`\`json file="" isHidden
