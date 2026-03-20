# 🚀 Cloudflare Deployment Guide - CIBC Admin Backend

Panduan lengkap lokasi folder, setup project, dan deploy ke Cloudflare.

---

## 📁 STRUKTUR FOLDER PROJECT

### Opsi 1: MONOREPO (Recommended)
Kalau mau 1 repository dengan FE dan BE bareng:

```
/Users/mekari/kath-laddingpage/         ← Root (FE ada disini)
├── app/                                ← Frontend React (existing)
├── src/                                ← Frontend source (existing)
├── backend/                            ← 🆕 Backend folder BARU
│   ├── cibc-admin-api/                 ← Cloudflare Workers project
│   │   ├── src/
│   │   ├── migrations/
│   │   ├── wrangler.toml
│   │   └── package.json
│   └── README.md
├── package.json                        ← Root package (scripts untuk run both)
└── README.md
```

**Keuntungan:**
- 1 repo, mudah manage
- Shared types bisa di-link
- 1 command run dev (FE + BE)

### Opsi 2: SEPARATE REPO
Kalau mau pisah (lebih clean untuk production):

```
/Users/mekari/kath-laddingpage/         ← Frontend (existing)
/Users/mekari/cibc-admin-backend/       ← Backend (new folder)
    ├── src/
    ├── migrations/
    ├── wrangler.toml
    └── package.json
```

**Keuntungan:**
- BE bisa deploy independent
- Team bisa kerja terpisah
- Lebih clean untuk CI/CD

---

## 🛠️ STEP BY STEP SETUP

### STEP 1: Install Cloudflare CLI

```bash
# Install wrangler secara global
npm install -g wrangler

# Atau pakai npx (tanpa install global)
npx wrangler --version

# Login ke Cloudflare account
wrangler login
# Ini akan buka browser, login dengan akun Cloudflare lo
```

**Verifikasi:**
```bash
wrangler whoami
# Output: Anda telah login dengan akun X (email lo)
```

---

### STEP 2: Create Backend Project

#### Opsi A: Create New (kalau pisah repo)

```bash
# Buka folder parent
 cd /Users/mekari

# Buat folder baru untuk backend
mkdir cibc-admin-backend
cd cibc-admin-backend

# Init project dengan Cloudflare template
npm create cloudflare@latest .

# Pilih:
# ? What type of application do you want to create? > "Hello World" Worker
# ? Which lang template? > TypeScript
# ? Do you want to use git for version control? > Yes
```

#### Opsi B: Create dalam Monorepo (kalau gabung)

```bash
# Dari root project lo
 cd /Users/mekari/kath-laddingpage

# Buat folder backend
mkdir -p backend/cibc-admin-api
cd backend/cibc-admin-api

# Init project
npm create cloudflare@latest .

# Pilih:
# ? What type of application? > "Hello World" Worker
# ? Which lang? > TypeScript
# ? Do you want to use git? > No (sudah ada git di root)
```

---

### STEP 3: Setup Project Structure

```bash
# Di dalam folder backend (cibc-admin-backend atau backend/cibc-admin-api)

# Buat struktur folder
mkdir -p src/{controllers,services,middleware,utils,types}
mkdir -p migrations
mkdir -p tests

# File yang perlu dibuat
touch src/index.ts
touch src/config/constants.ts
touch src/config/database.ts
touch wrangler.toml
```

**Struktur final:**
```
cibc-admin-backend/                   ← atau backend/cibc-admin-api/
├── src/
│   ├── index.ts                      # Entry point
│   ├── config/
│   │   ├── constants.ts              # App constants
│   │   └── database.ts               # D1 helpers
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── competition.controller.ts
│   │   ├── stage.controller.ts
│   │   ├── task.controller.ts
│   │   ├── team.controller.ts
│   │   ├── submission.controller.ts
│   │   ├── grading.controller.ts
│   │   ├── announcement.controller.ts
│   │   ├── notification.controller.ts
│   │   └── public.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── competition.service.ts
│   │   ├── stage.service.ts
│   │   ├── task.service.ts
│   │   ├── team.service.ts
│   │   ├── submission.service.ts
│   │   ├── storage.service.ts
│   │   ├── notification.service.ts
│   │   └── audit.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── cors.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── audit.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── validation.ts
│   │   ├── response.ts
│   │   ├── storage.ts
│   │   └── helpers.ts
│   └── types/
│       ├── api.ts
│       ├── database.ts
│       └── index.ts
├── migrations/
│   ├── 001_initial_schema.sql
│   └── 002_seed_data.sql
├── tests/
├── wrangler.toml
├── package.json
├── tsconfig.json
└── README.md
```

---

### STEP 4: Configure wrangler.toml

Buat/Edit file `wrangler.toml`:

```toml
name = "cibc-admin-api"
main = "src/index.ts"
compatibility_date = "2025-03-18"

# Workers runtime
[build]
command = "npm run build"

# Environment Variables (secrets)
[vars]
ENVIRONMENT = "development"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "cibc-admin-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Akan diisi setelah create DB

# R2 Storage (for file uploads)
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "cibc-storage"

# KV Namespace (for caching, rate limiting)
[[kv_namespaces]]
binding = "CACHE"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Secrets (jangan taro di sini, pakai wrangler secret put)
# JWT_SECRET
# JWT_REFRESH_SECRET
# ADMIN_DEFAULT_PASSWORD

# Environment: Production
[env.production]
name = "cibc-admin-api-prod"
[env.production.vars]
ENVIRONMENT = "production"

# D1 Production
[[env.production.d1_databases]]
binding = "DB"
database_name = "cibc-admin-db-prod"
database_id = "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"

# R2 Production
[[env.production.r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "cibc-storage-prod"
```

---

### STEP 5: Setup D1 Database

#### 5.1 Create Database

```bash
# Development database
wrangler d1 create cibc-admin-db

# Output:
# ✅ Successfully created D1 database "cibc-admin-db"
# Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# Copy ID ini, paste ke wrangler.toml
```

```bash
# Production database (kalau sudah siap deploy)
wrangler d1 create cibc-admin-db-prod
```

#### 5.2 Update wrangler.toml

Edit `wrangler.toml`, paste database_id yang didapat:

```toml
[[d1_databases]]
binding = "DB"
database_name = "cibc-admin-db"
database_id = "PASTE_ID_DI_SINI"
```

#### 5.3 Run Migrations

```bash
# Local development (gunakan local DB)
wrangler d1 execute cibc-admin-db --local --file=./migrations/001_initial_schema.sql
wrangler d1 execute cibc-admin-db --local --file=./migrations/002_seed_data.sql

# Remote (production)
wrangler d1 execute cibc-admin-db --remote --file=./migrations/001_initial_schema.sql
wrangler d1 execute cibc-admin-db --remote --file=./migrations/002_seed_data.sql
```

---

### STEP 6: Setup R2 Storage

```bash
# Development bucket
wrangler r2 bucket create cibc-storage

# Production bucket
wrangler r2 bucket create cibc-storage-prod
```

**Verifikasi:**
```bash
wrangler r2 bucket list
```

---

### STEP 7: Set Secrets

Secrets (seperti JWT key) tidak boleh di-push ke repo. Simpan sebagai Cloudflare secrets:

```bash
# Generate random secrets
code:
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Set secrets via wrangler
wrangler secret put JWT_SECRET
# Paste secret, tekan Ctrl+D

wrangler secret put JWT_REFRESH_SECRET
# Paste secret, tekan Ctrl+D

wrangler secret put ADMIN_DEFAULT_PASSWORD
# Input: admin123 (atau password yang lo mau)

# Untuk production
wrangler secret put JWT_SECRET --env production
wrangler secret put JWT_REFRESH_SECRET --env production
wrangler secret put ADMIN_DEFAULT_PASSWORD --env production
```

---

### STEP 8: Local Development

```bash
# Install dependencies
npm install

# Install packages yang diperlukan
npm install @cloudflare/workers-types bcryptjs jsonwebtoken zod
npm install -D typescript @types/bcryptjs @types/jsonwebtoken

# Run local dev server
wrangler dev

# Output:
# ⛅️ wrangler 3.x.x
# -------------------
# ⬣ Listening at http://localhost:8787
# ⬣ Debug at https://example.com
```

**Test:**
```bash
curl http://localhost:8787/api/v1/health
# Output: {"success":true,"status":"healthy"}
```

---

### STEP 9: Deploy ke Cloudflare

#### Deploy Development

```bash
# Deploy ke workers.dev (gratis subdomain)
wrangler deploy

# Output:
# ✅ Published cibc-admin-api (dev)
# https://cibc-admin-api.your-account.workers.dev
```

#### Deploy Production (dengan custom domain)

```bash
# Deploy ke production environment
wrangler deploy --env production

# Output:
# ✅ Published cibc-admin-api-prod (production)
```

#### Setup Custom Domain (opsional)

```bash
# Tambahkan custom domain (misal: api.kathevent.com)
wrangler route add api.kathevent.com/* --zone_id=YOUR_ZONE_ID

# Atau lewat Cloudflare Dashboard:
# Workers & Pages → cibc-admin-api → Triggers → Custom Domains
# Add Custom Domain: api.kathevent.com
```

---

## 📋 RINGKASAN PERINTAH WRANGLER

### Database
```bash
# Create database
wrangler d1 create <nama-db>

# List databases
wrangler d1 list

# Execute SQL file
wrangler d1 execute <nama-db> --file=./schema.sql

# Query langsung
wrangler d1 execute <nama-db> --command="SELECT * FROM users"
```

### R2 Storage
```bash
# Create bucket
wrangler r2 bucket create <nama-bucket>

# List buckets
wrangler r2 bucket list

# Upload file
wrangler r2 object put <bucket>/<key> --file=./localfile.pdf
```

### Secrets
```bash
# Set secret
wrangler secret put <KEY>

# List secrets
wrangler secret list

# Delete secret
wrangler secret delete <KEY>
```

### Deploy
```bash
# Dev deploy
wrangler deploy

# Production deploy
wrangler deploy --env production

# Dry run (cek tanpa deploy)
wrangler deploy --dry-run
```

### Logs & Debug
```bash
# Tail logs (real-time)
wrangler tail

# Tail production logs
wrangler tail --env production
```

---

## 🔌 CONNECT KE FRONTEND

### 1. Environment Variables (FE)

Tambah di file `.env` frontend:

```bash
# Development (lokal)
VITE_API_URL=http://localhost:8787

# Production (Cloudflare)
VITE_API_URL=https://cibc-admin-api.your-account.workers.dev
# atau kalau custom domain:
VITE_API_URL=https://api.kathevent.com
```

### 2. CORS Setup (Backend)

Di `src/middleware/cors.middleware.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  # Atau spesifik domain:
  # 'Access-Control-Allow-Origin': 'https://kathevent.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};
```

**Production CORS (lebih aman):**
```typescript
const allowedOrigins = [
  'https://kathevent.com',
  'https://www.kathevent.com',
  'http://localhost:5173',  # Dev only
];

export function getCorsHeaders(origin: string) {
  if (allowedOrigins.includes(origin)) {
    return { ...corsHeaders, 'Access-Control-Allow-Origin': origin };
  }
  return corsHeaders;
}
```

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### Local Testing
- [ ] `wrangler dev` berjalan tanpa error
- [ ] Test endpoint `/api/v1/health` response OK
- [ ] Test auth flow (login → access protected → refresh)
- [ ] Test database query berfungsi
- [ ] Test file upload ke R2

### Database
- [ ] Migrations berhasil di-execute
- [ ] Seed data (default admin) ada
- [ ] Test query: `wrangler d1 execute DB --command="SELECT * FROM users"`

### Secrets
- [ ] `JWT_SECRET` di-set
- [ ] `JWT_REFRESH_SECRET` di-set
- [ ] `ADMIN_DEFAULT_PASSWORD` di-set

### Cloudflare Resources
- [ ] D1 database created
- [ ] R2 bucket created
- [ ] (Opsional) KV namespace created

### Deploy
- [ ] `wrangler deploy` sukses
- [ ] URL workers.dev berfungsi
- [ ] Test endpoint dari Postman/curl
- [ ] CORS headers benar

---

## 🚨 TROUBLESHOOTING

### Error: "database_id not found"
```bash
# Solusi: Copy database_id dari output create, paste ke wrangler.toml
wrangler d1 list  # Lihat ID
```

### Error: "secrets not found"
```bash
# Solusi: Set secrets lagi
wrangler secret put JWT_SECRET
```

### Error: CORS saat fetch dari FE
```bash
# Solusi: Pastikan CORS middleware aktif
# Check: Response header harus ada Access-Control-Allow-Origin
```

### Error: "cannot resolve module"
```bash
# Solusi: Install dependencies
npm install
```

### Database lokal tidak persist
```bash
# Solusi: Gunakan flag --persist-to
wrangler dev --persist-to=./.wrangler/state
```

---

## 📁 CONTOH: ROOT PACKAGE.JSON (Monorepo)

Kalau pakai monorepo, tambah di root `package.json`:

```json
{
  "name": "kath-cibc-platform",
  "private": true,
  "workspaces": [
    "app",
    "backend/cibc-admin-api"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:fe\" \"npm run dev:be\"",
    "dev:fe": "cd app && npm run dev",
    "dev:be": "cd backend/cibc-admin-api && wrangler dev",
    "build": "cd app && npm run build",
    "deploy:be": "cd backend/cibc-admin-api && wrangler deploy",
    "db:migrate": "cd backend/cibc-admin-api && wrangler d1 execute cibc-admin-db --file=./migrations/001_initial_schema.sql"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

**Usage:**
```bash
# Run FE + BE bareng
npm run dev

# Deploy backend only
npm run deploy:be

# Run migration
npm run db:migrate
```

---

## 🎯 NEXT STEPS

1. **Pilih lokasi folder** (monorepo atau separate)
2. **Jalankan Step 1-3** (install wrangler, create project)
3. **Bikin database** (Step 5)
4. **Copy kode backend** yang sudah dibuat (atau mulai dari Phase 1)
5. **Deploy** dan test

**Butuh gw bikin script otomatis setup?** Atau langsung bikin kode backend-nya? 🚀
