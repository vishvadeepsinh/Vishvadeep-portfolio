# Pre-Deployment Checklist

Use this checklist before deploying to production:

## Code Quality
- [ ] All TypeScript errors resolved (`npm run build`)
- [ ] ESLint warnings addressed
- [ ] No console.log statements in production code
- [ ] Code reviewed and tested

## Database
- [ ] Database schema is up to date
- [ ] All migration scripts have been run
- [ ] Seed data is appropriate for production
- [ ] Database backups configured

## Environment Variables
- [ ] All required environment variables set in Vercel
- [ ] No sensitive data in code
- [ ] `.env.local` not committed to Git
- [ ] API keys are valid and active

## Security
- [ ] Admin routes are protected
- [ ] RLS policies configured in Supabase
- [ ] CORS settings are correct
- [ ] Rate limiting implemented (if needed)

## Performance
- [ ] Images optimized
- [ ] Unused dependencies removed
- [ ] Build size is reasonable
- [ ] Loading states implemented

## Content
- [ ] All placeholder text replaced
- [ ] Profile information updated
- [ ] Projects added with images
- [ ] Contact information correct

## Testing
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Forms submit successfully
- [ ] Admin panel is accessible
- [ ] Mobile responsive design verified
- [ ] Cross-browser testing completed

## Documentation
- [ ] README.md is up to date
- [ ] Setup instructions are clear
- [ ] API documentation complete
- [ ] Comments added to complex code

## Post-Deployment
- [ ] Verify live site loads
- [ ] Test all forms on production
- [ ] Check admin login works
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Submit sitemap to search engines

## Rollback Plan
- [ ] Previous version tagged in Git
- [ ] Database backup created
- [ ] Rollback procedure documented
- [ ] Team notified of deployment

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Version:** _____________

**Notes:**
