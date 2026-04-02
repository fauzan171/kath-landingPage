# 📋 Ringkasan Prompt untuk Tim Development

Dokumen ini berisi ringkasan prompt yang sudah dibuat untuk membantu tim Backend dan Frontend.

---

## 🎯 Daftar Prompt yang Tersedia

### Untuk Backend Developer

| File | Topik | Status |
|------|-------|--------|
| `docs/prompts/backend/01-backend-setup.md` | Setup project, structure, dependencies | ✅ Created |
| `docs/prompts/backend/03-backend-auth.md` | Authentication system (JWT) | ✅ Created |

### Untuk Frontend Developer

| File | Topik | Status |
|------|-------|--------|
| `docs/prompts/frontend/07-frontend-api-integration.md` | Fix API integration & auth | ✅ Created |

### Master Prompt (Untuk AI Assistant)

| File | Deskripsi |
|------|-----------|
| `docs/prompts/MASTER_PROMPT.md` | **Prompt utama** untuk memulai sesi dengan AI |

---

## 🚀 Cara Menggunakan

### 1. Untuk Backend Setup

**Copy prompt ini ke AI assistant:**

```
Tolong setup backend untuk CIBC Competition System.
Ikuti panduan di: docs/prompts/backend/01-backend-setup.md

Task:
1. Initialize Cloudflare Workers project
2. Setup folder structure
3. Configure wrangler.toml
4. Create database migrations
5. Setup base types & utils
```

### 2. Untuk Auth System

**Copy prompt ini ke AI assistant:**

```
Tolong implementasi auth system dengan JWT.
Ikuti panduan di: docs/prompts/backend/03-backend-auth.md

Task:
1. Create auth service (login, refresh, logout)
2. Create auth controller
3. Setup JWT middleware
4. Test authentication flow
```

### 3. Untuk Frontend API Fix

**Copy prompt ini ke AI assistant:**

```
Tolong fix frontend API integration.
Ikuti panduan di: docs/prompts/frontend/07-frontend-api-integration.md

Task:
1. Update API base URL ke localhost:8787
2. Fix auth service dengan refresh token
3. Add fetch retry logic
4. Test login flow
```

### 4. Untuk Session Baru dengan AI

**Gunakan Master Prompt:**

```
Copy seluruh isi file: docs/prompts/MASTER_PROMPT.md

Kemudian tambahkan task spesifik Anda di bagian:
## ✅ Task Pertama Saya
```

---

## 📌 Prioritas Implementasi

### Week 1: Foundation
```
✅ Backend: Setup project (01-backend-setup.md)
✅ Backend: Auth system (03-backend-auth.md)
✅ Frontend: Fix API config (07-frontend-api-integration.md)
```

### Week 2: Core Features
```
⬜ Backend: Competition & Stage API
⬜ Backend: Team & Submission API
⬜ Frontend: Registration flow
⬜ Frontend: Dashboard connection
```

### Week 3: Advanced Features
```
⬜ Backend: Grading system
⬜ Backend: Announcements & notifications
⬜ Frontend: Admin dashboard
⬜ Frontend: Real-time updates
```

### Week 4: Polish & Deploy
```
⬜ Testing
⬜ Bug fixes
⬜ Deployment
```

---

## 🔧 Quick Reference

### Backend Commands
```bash
# Development
npm run dev              # Start Cloudflare Workers (port 8787)
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database

# Deployment
npm run build            # Build
npm run deploy           # Deploy to Cloudflare
```

### Frontend Commands
```bash
# Development
npm run dev              # Start Vite (port 5173)

# Deployment
npm run build            # Build
npm run deploy           # Deploy to Cloudflare Pages
```

### Environment Setup

**Frontend (.env)**:
```bash
VITE_API_URL=http://localhost:8787/api/v1
```

**Backend (.env)**:
```bash
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

---

## 📊 Current Project Status

### ✅ Completed
- Project structure (Frontend)
- Basic services (auth, competition, cibc)
- Documentation & prompts

### ⚠️ In Progress
- Backend setup
- Auth system implementation
- API integration fixes

### ⏳ Pending
- Registration flow
- Dashboard connection
- Admin dashboard
- File upload (R2)
- Real-time notifications

---

## 🎯 Next Steps

1. **Backend Developer**: 
   - Mulai dengan `01-backend-setup.md`
   - Lanjut ke `03-backend-auth.md`
   - Test dengan curl

2. **Frontend Developer**:
   - Fix API configuration
   - Update auth service
   - Prepare registration form

3. **Integration Testing**:
   - Test login flow
   - Test registration flow
   - Test dashboard data fetching

---

## 📞 Kontak & Resources

### Documentation
- Main flow: `docs/prompts/complete-competition-system-flow.md`
- Backend spec: `docs/backend-spec/BACKEND_DETAILED_SPECIFICATION.md`
- API types: `docs/backend-spec/backend-api-types.ts`

### Key Files
- Frontend services: `src/services/`
- Backend entry: `src/index.ts` (akan dibuat)
- Database schema: `migrations/001_initial_schema.sql` (akan dibuat)

---

**Last Updated**: March 22, 2026
**Project**: KATH Event Organizer - CIBC Competition System
