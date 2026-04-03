# CIBC Competition Platform - Production Deployment Guide

## 🚀 Deployment Checklist

### Pre-Deployment Requirements

#### 1. Supabase Configuration
- [ ] Create Supabase project at https://supabase.com
- [ ] Run database migrations in order:
  - [ ] `supabase/migrations/v6.0.0-final-schema.sql`
- [ ] Configure authentication providers:
  - [ ] Email provider enabled
  - [ ] Set email confirmation required (optional)
- [ ] Configure storage buckets:
  - [ ] `payments` bucket (public)
  - [ ] `submissions` bucket (private)
  - [ ] `documents` bucket (private)

#### 2. Environment Variables

Create `.env` file with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_USE_MOCK_DATA=false
```

**Get these from:**
- Supabase Dashboard → Settings → API
- `VITE_SUPABASE_URL` = Project URL
- `VITE_SUPABASE_ANON_KEY` = anon public key

#### 3. Supabase Authentication Settings

Navigate to Authentication → URL Configuration:

- [ ] Site URL: `https://your-domain.com`
- [ ] Redirect URLs:
  - `https://your-domain.com/cibc/dashboard`
  - `https://your-domain.com/cibc/reset-password`
  - `https://your-domain.com/admin`
  - `https://your-domain.com/judge`

#### 4. Email Templates (Supabase)

Configure email templates in Authentication → Email Templates:

- [ ] Confirmation email
- [ ] Password reset email
- [ ] Magic link email

#### 5. Initial Admin Setup

After first deployment, set admin users:

```sql
-- Set super admin
UPDATE users
SET role = 'super_admin', status = 'approved'
WHERE email = 'admin@yourdomain.com';

-- Set judge users
UPDATE users
SET role = 'judge', status = 'approved'
WHERE email IN ('judge1@email.com', 'judge2@email.com');
```

---

## 📊 Database Migration Steps

### Fresh Installation

1. Open Supabase SQL Editor
2. Run `supabase/migrations/v6.0.0-final-schema.sql`
3. Verify tables created:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

### Upgrading from Previous Version

If you have existing data, backup first, then:

1. Run `supabase/migrations/v5.0.0-rls-policies-fix.sql`
2. Run `supabase/migrations/v5.1.0-missing-tables.sql`
3. Verify RLS policies:
   ```sql
   SELECT tablename, policyname FROM pg_policies
   WHERE schemaname = 'public';
   ```

---

## 🔐 Security Features Implemented

### 1. Row Level Security (RLS)
- **Users**: Own profile or admin access only
- **Teams**: Team members and admins only
- **Submissions**: Team members, judges, and admins only
- **Judge Scores**: Judges and admins only
- **Notifications**: Own notifications only

### 2. Authentication
- Supabase Auth with email/password
- Email verification (configurable)
- Session management with refresh tokens
- Password strength validation (8+ chars, mixed case, number)

### 3. Rate Limiting
- Login attempts: 5 per 5 minutes
- Automatic lockout with retry countdown
- Reset on successful login

### 4. CSRF Protection
- Token-based protection for forms
- Constant-time comparison
- One-time use tokens
- Automatic refresh after submission

### 5. Input Sanitization
- XSS prevention via HTML entity escaping
- Email normalization
- Phone number validation
- URL protocol checking

### 6. Role-Based Access Control (RBAC)
- Roles: `participant`, `admin`, `super_admin`, `finance_admin`, `judge`
- Protected routes with role verification
- Status checks (pending/approved/rejected)

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Register new user → Email verification → Login
- [ ] Password reset request → Email → Reset
- [ ] Login with wrong password (verify rate limiting)
- [ ] Session persistence after page refresh
- [ ] Logout clears all session data

### Authorization Tests
- [ ] Participant cannot access `/admin`
- [ ] Participant cannot access `/judge`
- [ ] Judge can access `/judge` but not `/admin`
- [ ] Admin can access `/admin`

### Security Tests
- [ ] RLS blocks cross-team data access
- [ ] CSRF token validation works
- [ ] Rate limiting blocks brute force
- [ ] Input sanitization prevents XSS

---

## 📦 Build & Deploy Commands

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

### Deployment (Cloudflare Pages)
```bash
npm run build
# Deploy dist/ folder
```

### Deployment (Vercel)
```bash
vercel --prod
```

### Deployment (Netlify)
```bash
npm run build
netlify deploy --prod
```

---

## 🔄 Rollback Procedure

### Database Rollback
Keep backup of previous schema:
```bash
pg_dump -h db.xxx.supabase.co -U postgres > backup_$(date +%Y%m%d).sql
```

### Application Rollback
```bash
git revert HEAD
npm run build
# Redeploy
```

---

## ⚠️ Known Issues & Technical Debt

### Phase 4 Items (Future Sprint)

1. **Error Boundaries**
   - Add error boundary components
   - Graceful error handling UI

2. **Loading States**
   - Standardize loading indicators
   - Skeleton screens for tables

3. **Pagination**
   - Add to AdminUsers, AdminSubmissions
   - Infinite scroll for notifications

4. **Console Log Cleanup**
   - Remove development console.logs
   - Keep only error logging

5. **Documentation**
   - JSDoc comments for public functions
   - API documentation

---

## 📈 Monitoring & Alerts

### Recommended Alerts
- Error rate > 1% in any 5-minute window
- Failed login attempts > 10 from same IP
- Database query time > 2 seconds
- Auth errors spike

### Logging
All authentication events are logged to `audit_logs` table:
- User created
- Status changed
- Role changed
- Login attempts (add manually if needed)

---

## 🎯 Post-Deployment Verification

Run these checks after deployment:

```bash
# 1. Check site loads
curl -I https://your-domain.com

# 2. Check API health
curl https://your-project.supabase.co/rest/v1/

# 3. Test login endpoint
# Use browser or curl with proper credentials
```

---

## 📞 Support Contacts

- **Supabase Support**: https://supabase.com/support
- **Platform Issues**: Create issue in repository

---

## ✅ Sign-Off

After completing all checks:

| Check | Status | Date | Initial |
|-------|--------|------|---------|
| Database migrated | | | |
| Environment configured | | | |
| Auth flows tested | | | |
| RLS policies verified | | | |
| Admin users created | | | |
| Production build tested | | | |
| Deployed successfully | | | |

**Approved for Production**: _______________ Date: _______________