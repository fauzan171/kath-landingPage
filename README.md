# KATH Event Organizer - CIBC Dashboard

Landing page dan platform kompetisi BMC untuk **CIBC Power by KATH 2026**.

## 🏗️ Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│                    Deploy: Cloudflare Pages                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌───────────────┐ ┌──────────┐ ┌─────────────────┐
        │   SUPABASE    │ │   n8n    │ │  GOOGLE DRIVE   │
        │  PostgreSQL   │ │ Workflow │ │    Storage      │
        │   (500MB)     │ │ (FREE)   │ │    (15GB)       │
        │   $0/month    │ │ $0/month │ │   $0/month      │
        └───────────────┘ └──────────┘ └─────────────────┘
```

**Total Cost: $0/bulan** ✨

## 🚀 Deploy ke Cloudflare

### Prerequisites

- Node.js 20+
- Cloudflare account
- Supabase project (sudah di-setup)
- n8n instance (opsional, untuk file upload)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Environment Variables

```bash
# Copy template
cp .env.example .env

# Edit dengan credentials Anda
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook
```

### Step 3: Build & Preview

```bash
# Build
npm run build

# Preview lokal
npm run preview
```

### Step 4: Deploy ke Cloudflare

**Option A: Via Wrangler CLI**

```bash
# Login ke Cloudflare
npx wrangler login

# Deploy
npm run deploy
```

**Option B: Via Cloudflare Dashboard**

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih **Pages** → **Create a project**
3. Connect GitHub repository
4. Configure build:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
5. Set environment variables di Settings → Environment variables

### Step 5: Set Environment Variables di Cloudflare

Di Cloudflare Pages Dashboard → Settings → Environment variables:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook
VITE_APP_NAME=KATH Event Organizer
VITE_APP_URL=https://your-site.pages.dev
```

## 📁 Struktur Project

```
kath-laddingpage/
├── src/
│   ├── components/        # React components
│   ├── sections/          # Page sections
│   ├── services/          # API services
│   │   ├── supabase.service.ts    # CIBC services
│   │   └── supabaseNews.service.ts # News service
│   ├── lib/
│   │   └── supabase.ts    # Supabase client
│   └── config/
│       └── environment.ts # Env configuration
├── public/
│   ├── _headers           # Cloudflare security headers
│   └── _redirects         # SPA routing
├── supabase/
│   ├── schema.sql         # Database schema
│   ├── seed.sql           # Seed data
│   └── migrations/        # Migration files
├── n8n/
│   └── cibc-upload-workflow.json  # File upload workflow
├── docs/                  # Documentation
├── dist/                  # Build output
├── wrangler.jsonc         # Cloudflare config
└── vite.config.ts         # Vite config
```

## 🛠️ Scripts

```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview build locally
npm run deploy   # Deploy to Cloudflare
npm run lint     # Run ESLint
```

## 📊 Services

| Service | Methods | Description |
|---------|---------|-------------|
| Auth | 8 | Authentication |
| Competition | 10 | Single competition + timeline |
| Stage | 4 | Stage management |
| Task | 5 | Task management |
| Team | 6 | Team management |
| Submission | 8 | Submission + file upload |
| Announcement | 4 | Announcements |
| News | 14 | News CRUD |

## 🔐 Security

- Row Level Security (RLS) di Supabase
- Content Security Policy (CSP) headers
- X-Frame-Options: DENY
- HTTPS enforced by Cloudflare

## 📚 Dokumentasi

Lihat folder `docs/` untuk dokumentasi lengkap:
- `docs/guides/SETUP.md` - Setup guide
- `docs/specs/` - Technical specifications
- `docs/prompts/` - Development prompts

## 🎨 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Animation**: GSAP, Lenis
- **Database**: Supabase PostgreSQL
- **Storage**: Google Drive (via n8n)
- **Deployment**: Cloudflare Pages

## 📝 License

MIT License - KATH Event Organizer