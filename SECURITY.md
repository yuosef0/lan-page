# 🔒 Security Guide

## Admin-Only Access

This portfolio website is designed with **admin-only** authentication. Regular users **cannot** create accounts.

### Important Security Steps

#### 1. Disable Public Sign-Ups in Supabase

**CRITICAL:** After creating your Supabase project, you MUST disable public registration:

1. Go to Supabase Dashboard
2. Navigate to **Authentication > Providers**
3. Click on **Email** provider
4. **Uncheck "Enable sign ups"**
5. Click **Save**

This prevents anyone from creating new accounts via the API.

#### 2. Create Admin Users Manually

Only create admin users through Supabase Dashboard:

1. Go to **Authentication > Users**
2. Click **Add User**
3. Enter email and password
4. Check **Auto Confirm User**
5. Click **Create User**

#### 3. Row Level Security (RLS)

The database uses RLS policies to protect data:

- **Public users**: Can only READ content (services, about, home, contact info)
- **Authenticated users**: Can CREATE, UPDATE, DELETE all content
- **Contact submissions**: Anyone can INSERT, only authenticated users can READ

### Best Practices

1. **Use strong passwords** for admin accounts (minimum 12 characters)
2. **Rotate passwords** regularly
3. **Delete unused admin accounts** from Supabase Dashboard
4. **Monitor Authentication logs** in Supabase for suspicious activity
5. **Enable 2FA** on your Supabase account

### Environment Variables

Keep your `.env.local` file secure and NEVER commit it to git:

```bash
# These are PUBLIC keys (safe to expose in frontend)
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NEVER expose these (not used in this project):
# SUPABASE_SERVICE_ROLE_KEY=xxx  ⚠️ KEEP SECRET
```

### Reporting Security Issues

If you find a security vulnerability, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. Contact the project maintainer directly
3. Provide detailed information about the vulnerability

## Production Deployment Checklist

Before deploying to production:

- [ ] Disabled public sign-ups in Supabase
- [ ] Created admin user with strong password
- [ ] Removed all test/demo users
- [ ] Verified RLS policies are enabled
- [ ] Checked environment variables are set correctly
- [ ] Tested authentication flow
- [ ] Reviewed Supabase Authentication logs

## Additional Security Measures (Optional)

### IP Whitelisting

For extra security, you can restrict admin access by IP:

1. Use Supabase Edge Functions with IP checking
2. Configure your hosting provider's firewall
3. Use a VPN for admin access

### Email Verification

Enable email verification for added security:

1. Go to **Authentication > Email Templates**
2. Customize confirmation email
3. Uncheck "Auto Confirm User" when creating admins

### Audit Logging

Monitor all admin actions:

1. Use Supabase's built-in logging
2. Check **Database > Logs** regularly
3. Set up alerts for suspicious activities

---

**Remember:** Security is an ongoing process. Regularly review and update your security measures.
