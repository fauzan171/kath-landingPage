# 🚀 KATH Event Organizer - Master Prompt untuk AI Assistant

## 📋 Gunakan prompt ini untuk memulai sesi dengan AI assistant

---

## PROMPT UTAMA (Copy-Paste ini ke AI assistant)

```
Saya sedang mengembangkan **KATH Event Organizer - CIBC Power by KATH 2026**, sebuah Competition Management System.

## 🎯 Project Overview

**Nama**: CIBC Power by KATH 2026
**Tipe**: Competition Management System (CMS)
**Users**: Public → Participants → Admin
**Flow**: Landing Page → Registration → Verification → Login → Dashboard → Submission

## 🏗️ Tech Stack

### Frontend (Sudah ada)
- React 19 + TypeScript + Vite
- Deploy: Cloudflare Pages
- Styling: Tailwind CSS + shadcn/ui
- State: React Context + localStorage

### Backend (Dalam pengembangan)
- Cloudflare Workers + Hono framework
- Database: Cloudflare D1 (SQLite)
- Storage: Cloudflare R2
- Auth: JWT (Access 15min, Refresh 7days)

## 📁 Project Structure

```
kath-laddingpage/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── cibc/         # Competition pages
│   │   ├── Register.tsx
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── services/         # API services
│   │   ├── api.ts        # Base API config
│   │   ├── auth.service.ts
│   │   ├── cibc.service.ts
│   │   ├── competition.service.ts
│   │   └── team.service.ts (NEEDS TO BE CREATED)
│   ├── contexts/         # React contexts
│   └── types/            # TypeScript types
├── docs/
│   ├── backend-spec/     # Backend specifications
│   ├── prompts/          # Development prompts
│   └── specs/            # Frontend specs
└── .env.example
```

## 🐛 Current Issues

### Backend Issues:
1. ✅ Backend project perlu di-setup dari awal
2. ✅ Database schema perlu di-migrate
3. ✅ Auth system perlu di-implementasi
4. ✅ API endpoints perlu dibuat

### Frontend Issues:
1. ❌ API base URL masih salah (`localhost:3001` seharusnya `localhost:8787`)
2. ❌ Auth service masih menggunakan localStorage (kurang secure)
3. ❌ Tidak ada refresh token mechanism
4. ❌ Registration flow belum connect ke backend
5. ❌ Dashboard masih menggunakan mock data
6. ❌ Error handling belum proper

## 🎯 Yang Saya Butuhkan Sekarang

### Priority 1: Backend Setup
Bantu saya setup backend dengan:
1. Initialize Cloudflare Workers project
2. Setup database migrations
3. Implementasi auth system (login, logout, refresh)
4. Buat competition & team API endpoints

Lihat: `docs/prompts/backend/01-backend-setup.md` dan `docs/prompts/backend/03-backend-auth.md`

### Priority 2: Frontend Integration
Bantu saya fix frontend:
1. Update API base URL configuration
2. Fix auth service dengan proper token handling
3. Create team service untuk registration
4. Connect dashboard ke backend API

Lihat: `docs/prompts/frontend/07-frontend-api-integration.md`

### Priority 3: Registration Flow
Bantu saya implementasi registration flow yang benar:
1. Form submission → create team
2. Upload payment proof → R2 storage
3. Show pending verification status
4. Admin verification flow

Lihat: `docs/prompts/complete-competition-system-flow.md`

## 📚 Documentation Tersedia

1. **Complete Flow**: `docs/prompts/complete-competition-system-flow.md`
2. **Backend Spec**: `docs/backend-spec/BACKEND_DETAILED_SPECIFICATION.md`
3. **Backend Roadmap**: `docs/backend-spec/BACKEND_IMPLEMENTATION_ROADMAP.md`
4. **Prompts**: `docs/prompts/README.md`

## 🚀 Cara Kerja Kita

Saya akan request task spesifik, dan kamu bisa:
1. **Generate code** untuk implementasi
2. **Fix existing code** yang bermasalah
3. **Create new files** yang dibutuhkan
4. **Update configuration** files

**PENTING**: 
- Selalu gunakan TypeScript
- Ikuti existing code style di project
- Prioritaskan error handling
- Buat code yang readable dan maintainable

## ✅ Task Pertama Saya

[TASK PERTAMA ANDA DI SINI - contoh: "Setup backend auth system"]

```

---

## 📌 Template Request untuk Task Spesifik

### 1. Backend Auth System
```
Tolong implementasi backend auth system dengan:
1. Create auth service (login, refresh, logout)
2. Create auth controller dengan error handling
3. Setup JWT middleware
4. Test dengan curl

Reference: docs/prompts/backend/03-backend-auth.md
```

### 2. Frontend API Fix
```
Tolong fix frontend API integration:
1. Update API base URL ke localhost:8787
2. Fix auth service dengan refresh token mechanism
3. Add fetch retry untuk handle 401 responses
4. Test login flow

Reference: docs/prompts/frontend/07-frontend-api-integration.md
```

### 3. Registration Flow
```
Tolong implementasi registration flow:
1. Create team.service.ts
2. Update Register.tsx untuk connect ke backend
3. Add payment proof upload
4. Create status page

Reference: docs/prompts/complete-competition-system-flow.md
```

### 4. Dashboard Connection
```
Tolong connect dashboard ke backend:
1. Fetch dashboard stats dari /api/v1/admin/dashboard/stats
2. Fetch teams dari /api/v1/admin/teams
3. Add real-time polling untuk notifications
4. Handle loading & error states

Reference: docs/backend-spec/BACKEND_DETAILED_SPECIFICATION.md (Dashboard section)
```

---

## 🎨 Code Style & Conventions

### TypeScript
- Gunakan interface untuk types
- Strict mode enabled
- No `any` type (gunakan `unknown` jika perlu)

### Naming
- Components: PascalCase (`RegisterPage`)
- Functions/variables: camelCase (`handleSubmit`)
- Files: kebab-case (`auth.service.ts`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Error Handling
- Selalu gunakan try-catch
- Return proper error messages
- Log errors untuk debugging

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

---

## 🔑 Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8787/api/v1
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_COMPETITION_CODE=cibc-2026
```

### Backend (.env)
```bash
JWT_SECRET=your-secret-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

---

## 📞 Quick Commands

### Frontend
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run deploy   # Deploy to Cloudflare Pages
```

### Backend
```bash
npm run dev          # Start dev server (port 8787)
npm run db:migrate   # Run migrations
npm run deploy       # Deploy to Cloudflare Workers
```

---

## ✅ Success Criteria

Project selesai jika:
- ✅ User bisa register → pending verification
- ✅ Admin bisa verify registration
- ✅ User bisa login → dashboard
- ✅ Dashboard menampilkan data dari backend
- ✅ Admin bisa manage competition content
- ✅ File upload ke R2 berfungsi
- ✅ Real-time notifications bekerja

---

**Siap untuk mulai bekerja! 🚀**

Copy prompt di atas dan tambahkan task spesifik Anda di bagian `## ✅ Task Pertama Saya`
