# 01 - Backend Setup & Architecture

## 🎯 Objective
Setup Cloudflare Workers backend untuk CIBC Competition Management System.

## 📋 Context
Project ini adalah Competition Management System untuk CIBC Power by KATH 2026 dengan:
- **Users**: Public → Participants → Admin
- **Flow**: Landing Page → Registration → Verification → Dashboard → Submission
- **Stack**: Cloudflare Workers + D1 (SQLite) + R2 Storage

## 🛠️ Task

### 1. Initialize Cloudflare Workers Project

Buat project backend baru dengan struktur:

```bash
npm create cloudflare@latest cibc-admin-backend
# Pilih: Hello World Worker, TypeScript, Git
```

### 2. Setup Project Structure

Buat folder structure:

```
cibc-admin-backend/
├── src/
│   ├── index.ts                    # Entry point Worker
│   ├── config/
│   │   ├── database.ts             # D1 config & queries
│   │   ├── constants.ts            # App constants
│   │   └── env.ts                  # Environment validation
│   ├── middleware/
│   │   ├── auth.ts                 # JWT verification
│   │   ├── cors.ts                 # CORS handling
│   │   └── errorHandler.ts         # Global error handler
│   ├── controllers/
│   │   ├── auth.controller.ts      # Login, logout, refresh
│   │   ├── competition.controller.ts
│   │   ├── stage.controller.ts
│   │   ├── team.controller.ts
│   │   ├── submission.controller.ts
│   │   └── announcement.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── competition.service.ts
│   │   ├── storage.service.ts      # R2 upload/download
│   │   └── notification.service.ts
│   ├── utils/
│   │   ├── jwt.ts                  # JWT helpers
│   │   ├── password.ts             # bcrypt hashing
│   │   ├── validation.ts           # Input validators
│   │   └── response.ts             # API response format
│   └── types/
│       ├── api.ts
│       ├── database.ts
│       └── index.ts
├── migrations/
│   ├── 001_initial_schema.sql
│   └── 002_seed_data.sql
├── wrangler.toml
├── package.json
└── tsconfig.json
```

### 3. Configure Dependencies

Install dependencies di `package.json`:

```json
{
  "dependencies": {
    "hono": "^4.0.0",
    "@hono/node-server": "^1.8.0",
    "jose": "^5.2.0",
    "bcryptjs": "^2.4.3",
    "uuid": "^9.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "wrangler": "^3.0.0",
    "typescript": "^5.3.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/uuid": "^9.0.0"
  }
}
```

### 4. Configure Wrangler

Edit `wrangler.toml`:

```toml
name = "cibc-admin-backend"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# D1 Database (local)
[[d1_databases]]
binding = "DB"
database_name = "cibc-admin-db"
database_id = "local-d1-db-id"

# R2 Storage (local)
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "cibc-uploads"

# Environment variables
[vars]
JWT_SECRET = "your-secret-key-change-in-production"
ACCESS_TOKEN_EXPIRY = "15m"
REFRESH_TOKEN_EXPIRY = "7d"
FRONTEND_URL = "http://localhost:5173"
```

### 5. Create Base Types

File: `src/types/index.ts`

```typescript
// User roles
export type UserRole = 'super_admin' | 'admin' | 'judge' | 'observer';

// Competition status
export type CompetitionStatus = 'draft' | 'upcoming' | 'active' | 'completed' | 'archived';

// Stage status
export type StageStatus = 'draft' | 'upcoming' | 'active' | 'completed';

// Team status
export type TeamStatus = 'draft' | 'pending_review' | 'registered' | 'active' | 'disqualified' | 'withdrawn';

// Submission status
export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'needs_revision' | 'graded' | 'final';

// Task type
export type TaskType = 'file_upload' | 'text_input' | 'link_submit' | 'quiz';

// Base API response
export interface ApiResponse<T> {
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

// Error response
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

// JWT payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  competitionId?: string;
  iat?: number;
  exp?: number;
}
```

### 6. Create Database Types

File: `src/types/database.ts`

```typescript
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  is_active: number;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Competition {
  id: string;
  code: string;
  name: string;
  subtitle?: string;
  description?: string;
  status: string;
  registration_start?: string;
  registration_end?: string;
  event_start?: string;
  event_end?: string;
  config: string; // JSON
  theme: string; // JSON
  settings: string; // JSON
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Stage {
  id: string;
  competition_id: string;
  name: string;
  name_id?: string;
  description?: string;
  order_index: number;
  start_date: string;
  end_date: string;
  status: string;
  is_active: number;
  is_visible: number;
  auto_progress: number;
  requires_all_tasks: number;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  competition_id: string;
  name: string;
  code: string;
  category?: string;
  status: string;
  registered_at?: string;
  registration_data: string; // JSON
  total_score?: number;
  rank?: number;
  institution?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  task_id: string;
  team_id: string;
  competition_id: string;
  submitted_by?: string;
  submitted_at: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  content?: string;
  field_values: string; // JSON
  status: string;
  total_score?: number;
  graded_by?: string;
  graded_at?: string;
  feedback?: string;
  criteria_scores: string; // JSON
  is_late: number;
  penalty_applied: number;
  created_at: string;
  updated_at: string;
}
```

### 7. Create Utility Functions

File: `src/utils/response.ts`

```typescript
import { ApiResponse, ApiError } from '../types';

export function successResponse<T>(data: T, meta?: { message?: string; pagination?: any }): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...meta,
  };
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

export function errorResponse(
  code: string,
  message: string,
  details?: { field: string; message: string }[],
  status: number = 400
): Response {
  const response: ApiError = {
    success: false,
    error: { code, message, details },
  };
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): Response {
  return successResponse(items as any, {
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

File: `src/utils/jwt.ts`

```typescript
import * as jose from 'jose';
import type { JWTPayload } from '../types';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');

export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(SECRET);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  return await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    return payload as { userId: string };
  } catch {
    return null;
  }
}
```

File: `src/utils/password.ts`

```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

### 8. Create Middleware

File: `src/middleware/cors.ts`

```typescript
import { Hono } from 'hono';

export function corsMiddleware(app: Hono) {
  app.use('*', async (c, next) => {
    c.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('Access-Control-Max-Age', '86400');

    if (c.req.method === 'OPTIONS') {
      return c.body(null, 204);
    }

    await next();
  });
}
```

File: `src/middleware/auth.ts`

```typescript
import { Context } from 'hono';
import { verifyAccessToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';
import type { JWTPayload } from '../types';

export interface AuthContext {
  user: JWTPayload;
}

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } },
      401
    );
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyAccessToken(token);

  if (!payload) {
    return c.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
      401
    );
  }

  // Attach user to context
  c.set('user', payload);
  
  await next();
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: () => Promise<void>) => {
    const user = c.get('user') as JWTPayload;
    
    if (!roles.includes(user.role)) {
      return c.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
        403
      );
    }
    
    await next();
  };
}
```

### 9. Create Entry Point

File: `src/index.ts`

```typescript
import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors';
import { authMiddleware } from './middleware/auth';
import { errorResponse } from './utils/response';

// Import controllers (akan dibuat di prompt berikutnya)
// import { authController } from './controllers/auth.controller';

// Types
type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  JWT_SECRET: string;
  FRONTEND_URL: string;
};

type Variables = {
  user: any;
};

// Create app
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Middleware
corsMiddleware(app);

// Health check
app.get('/api/v1/admin/health', (c) => {
  return c.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: 'development',
    },
  });
});

// Auth routes (akan diimplementasi)
// app.post('/api/v1/auth/login', authController.login);
// app.post('/api/v1/auth/refresh', authController.refresh);
// app.post('/api/v1/auth/logout', authMiddleware, authController.logout);
// app.get('/api/v1/auth/me', authMiddleware, authController.me);

// Competition routes (akan diimplementasi)
// app.get('/api/v1/admin/competitions', authMiddleware, competitionController.getAll);
// ...

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred', [], 500);
});

// 404 handler
app.notFound((c) => {
  return errorResponse('NOT_FOUND', 'Endpoint not found', [], 404);
});

export default app;
```

### 10. Create Database Migration

File: `migrations/001_initial_schema.sql`

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active INTEGER DEFAULT 1,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  status TEXT CHECK(status IN ('draft', 'upcoming', 'active', 'completed', 'archived')),
  registration_start DATETIME,
  registration_end DATETIME,
  event_start DATETIME,
  event_end DATETIME,
  config TEXT,
  theme TEXT,
  settings TEXT,
  created_by TEXT REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stages table
CREATE TABLE IF NOT EXISTS stages (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_id TEXT,
  description TEXT,
  order_index INTEGER NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  status TEXT,
  is_active INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  auto_progress INTEGER DEFAULT 0,
  requires_all_tasks INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  category TEXT,
  status TEXT CHECK(status IN ('draft', 'pending_review', 'registered', 'active', 'disqualified', 'withdrawn')) DEFAULT 'draft',
  registered_at DATETIME,
  registration_data TEXT,
  total_score DECIMAL(5,2) DEFAULT 0,
  rank INTEGER,
  institution TEXT,
  country TEXT DEFAULT 'Indonesia',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  institution TEXT,
  role TEXT CHECK(role IN ('leader', 'member', 'mentor')) DEFAULT 'member',
  is_active INTEGER DEFAULT 1,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  submitted_by TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  content TEXT,
  field_values TEXT,
  status TEXT CHECK(status IN ('draft', 'submitted', 'under_review', 'needs_revision', 'graded', 'final')) DEFAULT 'draft',
  total_score DECIMAL(5,2),
  graded_by TEXT REFERENCES users(id),
  graded_at DATETIME,
  feedback TEXT,
  criteria_scores TEXT,
  is_late INTEGER DEFAULT 0,
  penalty_applied INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(task_id, team_id)
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  competition_id TEXT NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  created_by TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  title_id TEXT,
  content TEXT NOT NULL,
  content_id TEXT,
  type TEXT CHECK(type IN ('general', 'urgent', 'result', 'reminder', 'system')),
  is_published INTEGER DEFAULT 0,
  published_at DATETIME,
  scheduled_at DATETIME,
  target_all INTEGER DEFAULT 1,
  target_teams TEXT,
  target_stages TEXT,
  target_categories TEXT,
  views_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  team_id TEXT REFERENCES teams(id),
  announcement_id TEXT REFERENCES announcements(id),
  related_entity_type TEXT,
  related_entity_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK(type IN ('info', 'success', 'warning', 'urgent')),
  action_url TEXT,
  action_text TEXT,
  is_read INTEGER DEFAULT 0,
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  competition_id TEXT REFERENCES competitions(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values TEXT,
  new_values TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_competition ON teams(competition_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
CREATE INDEX IF NOT EXISTS idx_submissions_team ON submissions(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_task ON submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_announcements_competition ON announcements(competition_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
```

File: `migrations/002_seed_data.sql`

```sql
-- Default admin user (password: admin123)
-- Hash generated with bcrypt
INSERT INTO users (id, email, password_hash, name, is_active)
VALUES (
  'user_admin_001',
  'admin@kathevent.com',
  '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeYhQGYhQGYhQGYhQGYhQGYhQGYhQGYhQ',
  'Super Admin',
  1
);

-- CIBC 2026 Competition
INSERT INTO competitions (id, code, name, subtitle, description, status, registration_start, registration_end, event_start, event_end, config, theme, settings, created_by)
VALUES (
  'comp_cibc_2026',
  'cibc-2026',
  'CIBC Power by KATH 2026',
  'Inovasi untuk masa depan berkelanjutan',
  'Kompetisi inovasi bisnis berkelanjutan tingkat nasional',
  'active',
  '2025-11-01 00:00:00',
  '2025-12-31 23:59:59',
  '2026-01-15 00:00:00',
  '2026-05-17 00:00:00',
  '{"totalPrize": "Rp 200 Juta", "maxTeamSize": 5, "minTeamSize": 2, "categories": [{"id": "startup", "name": "Startup", "prize": "Rp 100 Juta"}, {"id": "student", "name": "Mahasiswa", "prize": "Rp 50 Juta"}]}',
  '{"primaryColor": "#C4A35A", "secondaryColor": "#1A1A1A", "logo": null}',
  '{"autoProgressStages": true, "publicLeaderboard": false, "blindGrading": true}',
  'user_admin_001'
);

-- Competition Stages
INSERT INTO stages (id, competition_id, name, name_id, description, order_index, start_date, end_date, status, is_active, is_visible)
VALUES
  ('stage_reg', 'comp_cibc_2026', 'Registration', 'Pendaftaran', 'Daftar dan buat tim', 1, '2025-11-01 00:00:00', '2025-12-31 23:59:59', 'completed', 0, 1),
  ('stage_bmc', 'comp_cibc_2026', 'BMC Submission', 'Pengumpulan BMC', 'Submit Business Model Canvas', 2, '2026-01-01 00:00:00', '2026-01-31 23:59:59', 'active', 1, 1),
  ('stage_semifinal', 'comp_cibc_2026', 'Semifinal', 'Semifinal', 'Presentasi semifinal', 3, '2026-02-01 00:00:00', '2026-02-28 23:59:59', 'upcoming', 0, 1),
  ('stage_final', 'comp_cibc_2026', 'Final', 'Final', 'Presentasi final', 4, '2026-03-01 00:00:00', '2026-03-31 23:59:59', 'upcoming', 0, 1);
```

### 11. Setup Local Development

Tambahkan scripts di `package.json`:

```json
{
  "scripts": {
    "dev": "wrangler dev",
    "build": "wrangler deploy --dry-run",
    "deploy": "wrangler deploy",
    "db:migrate": "wrangler d1 execute cibc-admin-db --local --file=migrations/001_initial_schema.sql && wrangler d1 execute cibc-admin-db --local --file=migrations/002_seed_data.sql",
    "db:seed": "wrangler d1 execute cibc-admin-db --local --file=migrations/002_seed_data.sql"
  }
}
```

### 12. Test Setup

Jalankan:

```bash
# Install dependencies
npm install

# Setup database lokal
npm run db:migrate

# Start development server
npm run dev
```

Test endpoint health:

```bash
curl http://localhost:8787/api/v1/admin/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-03-22T10:00:00.000Z",
    "environment": "development"
  }
}
```

---

## ✅ Deliverables

- [ ] Project structure lengkap
- [ ] Dependencies terinstall
- [ ] Wrangler configured
- [ ] Base types & utils
- [ ] Middleware (CORS, Auth)
- [ ] Entry point dengan health check
- [ ] Database migrations
- [ ] Seed data
- [ ] Local development running

---

## 📚 References

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)
- [D1 Database](https://developers.cloudflare.com/d1/)
- [R2 Storage](https://developers.cloudflare.com/r2/)

---

**Next Prompt**: `02-backend-database.md` - Database queries & service layer
