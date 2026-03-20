# 🏗️ CIBC Admin Dashboard - Backend Implementation Prompt

## Agent: Backend Engineer
**Priority:** P0 - Critical Path
**Timeline:** 5-7 days untuk core backend
**Output:** Production-ready backend API

---

## 📋 Context & Overview

**Project:** CIBC Power by KATH - Competition Management Platform  
**Type:** Backend API (REST)  
**Stack:** Cloudflare Workers + D1 (SQLite) + R2 Storage + KV Cache  
**Users:** Admin, Judges, Observers (multi-tenant per competition)  
**Scale:** 500+ teams, 2000+ submissions, real-time updates  

---

## 🎯 Your Mission

Anda akan membangun **complete backend system** untuk competition management dashboard berdasarkan dokumentasi yang sudah ada di project.

### Key Requirements:
1. ✅ **Multi-tenant** - Data isolation per competition
2. ✅ **Role-based Access Control** - super_admin, admin, judge, observer
3. ✅ **JWT Authentication** - Access token (15min) + Refresh token (7days)
4. ✅ **File Upload** - R2 presigned URLs untuk submissions
5. ✅ **Real-time Updates** - WebSocket untuk live notifications
6. ✅ **Audit Logging** - Track semua write operations
7. ✅ **Production-ready** - Error handling, validation, security

---

## 📁 Documentation Reference

**WAJIB BACA file-file ini sebelum mulai:**

### 1. Business Requirements
- `/Users/mekari/kath-laddingpage/CIBC_COMPETITION_FLOW.md`
  - Competition flow lengkap
  - Timeline & stages
  - Judging criteria

### 2. Technical Specifications
- `/Users/mekari/kath-laddingpage/docs/backend-spec/BACKEND_ADMIN_DASHBOARD_ARCHITECTURE.md`
  - Infrastructure architecture
  - Database schema design
  - Authentication flow
  - API endpoints structure

- `/Users/mekari/kath-laddingpage/docs/backend-spec/BACKEND_DETAILED_SPECIFICATION.md`
  - Detailed database schema (11 tables)
  - API endpoint specifications (55 endpoints)
  - Request/response examples
  - Error codes

- `/Users/mekari/kath-laddingpage/docs/backend-spec/BACKEND_IMPLEMENTATION_ROADMAP.md`
  - Phase-by-phase implementation plan
  - Data flow diagrams
  - Testing checklist
  - Deployment checklist

### 3. Frontend Integration
- `/Users/mekari/kath-laddingpage/docs/backend-spec/FRONTEND_INTEGRATION_GUIDE.md`
  - API-driven sections
  - React hooks & services
  - Migration guide

### 4. Existing Project Context
- `/Users/mekari/kath-laddingpage/API_DOCUMENTATION.md`
  - Existing API docs (for reference)
- `/Users/mekari/kath-laddingpage/SCANNING_SUMMARY.md`
  - Current project issues
  - Security concerns

---

## 🏛️ Architecture Decisions

### 1. Backend Location (IMPORTANT!)

**BUKAN di dalam folder frontend!**

```
/Users/mekari/
├── kath-laddingpage/          # Existing frontend (React)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── kath-backend/               # ← NEW: Backend project (BERBEDA FOLDER)
    ├── src/
    ├── migrations/
    ├── wrangler.toml
    └── package.json
```

**Command untuk setup:**
```bash
cd /Users/mekari
mkdir kath-backend
cd kath-backend
npm create cloudflare@latest cibc-admin-backend -- --template=hello-world
cd cibc-admin-backend
npm install
```

---

### 2. Tech Stack

| Component | Technology | Reason |
|-----------|-----------|--------|
| **Runtime** | Cloudflare Workers | Serverless, edge, cheap |
| **Database** | D1 (SQLite) | Edge-native, 5M queries free |
| **Storage** | R2 | S3-compatible, cheap |
| **Cache** | KV | Fast key-value storage |
| **Language** | TypeScript | Type-safe, maintainable |
| **Auth** | JWT + bcrypt | Stateless, secure |
| **Validation** | Zod | Runtime type checking |
| **Testing** | Vitest | Fast, modern |

---

## 📊 Database Schema

**Create 11 tables** (dari BACKEND_DETAILED_SPECIFICATION.md):

### Core Tables:
1. **users** - Admin users (super_admin, admin, judge, observer)
2. **user_roles** - Role assignments per competition
3. **competitions** - Competition data (CIBC 2026, dll)
4. **stages** - Competition stages (Registration, BMC, Pitch, dll)
5. **tasks** - Submission requirements per stage
6. **teams** - Participant teams
7. **team_members** - Team member details
8. **submissions** - Team submissions
9. **announcements** - Admin announcements
10. **notifications** - User notifications
11. **audit_logs** - Audit trail

**Action:**
- Copy schema dari `BACKEND_DETAILED_SPECIFICATION.md`
- Paste ke `migrations/001_initial_schema.sql`
- Run migration: `wrangler d1 execute cibc-db --file=migrations/001_initial_schema.sql`

---

## 🔌 API Endpoints (55 Total)

### Phase 1: Authentication (Week 1)
```
POST   /api/v1/auth/login              # Login
POST   /api/v1/auth/logout             # Logout
POST   /api/v1/auth/refresh            # Refresh token
POST   /api/v1/admin/auth/context      # Set competition context
GET    /api/v1/auth/me                 # Current user info
```

### Phase 2: Competition Management (Week 2)
```
GET    /api/v1/admin/competitions      # List competitions
POST   /api/v1/admin/competitions      # Create competition
GET    /api/v1/admin/competitions/:id  # Get competition detail
PATCH  /api/v1/admin/competitions/:id  # Update competition
DELETE /api/v1/admin/competitions/:id  # Delete competition
```

### Phase 3: Stages & Tasks (Week 2-3)
```
GET    /api/v1/admin/stages            # List stages
POST   /api/v1/admin/stages            # Create stage
PATCH  /api/v1/admin/stages/:id        # Update stage
DELETE /api/v1/admin/stages/:id        # Delete stage
POST   /api/v1/admin/stages/:id/activate # Activate stage
GET    /api/v1/admin/tasks             # List tasks
POST   /api/v1/admin/stages/:id/tasks  # Create task
PATCH  /api/v1/admin/tasks/:id         # Update task
POST   /api/v1/admin/tasks/:id/publish # Publish task
```

### Phase 4: Teams & Submissions (Week 3-4)
```
GET    /api/v1/admin/teams             # List teams
GET    /api/v1/admin/teams/:id         # Get team detail
PATCH  /api/v1/admin/teams/:id/status  # Update team status
GET    /api/v1/admin/submissions       # List submissions
GET    /api/v1/admin/submissions/:id   # Get submission detail
POST   /api/v1/admin/submissions/:id/grade # Grade submission
```

### Phase 5: Public API (Week 4)
```
GET    /api/v1/public/competitions     # List public competitions
GET    /api/v1/public/competitions/:code # Competition detail
GET    /api/v1/public/competitions/:code/timeline # Stages & tasks
GET    /api/v1/public/competitions/:code/faqs # FAQs
```

**Reference:** `BACKEND_DETAILED_SPECIFICATION.md` untuk detail setiap endpoint!

---

## 🚀 Implementation Tasks

### DAY 1-2: Project Setup & Database

#### Task 1.1: Initialize Project
```bash
cd /Users/mekari
mkdir kath-backend
cd kath-backend
npm create cloudflare@latest cibc-admin-backend
# Pilih:
# - Template: Hello World
# - TypeScript: Yes
# - Deploy: Later

cd cibc-admin-backend
npm install
npm install -D wrangler
```

#### Task 1.2: Setup D1 Database
```bash
# Create database
wrangler d1 create cibc-db

# Create migration file
# Copy schema dari BACKEND_DETAILED_SPECIFICATION.md
# Paste ke migrations/001_initial_schema.sql

# Run migration (local)
wrangler d1 execute cibc-db --local --file=migrations/001_initial_schema.sql

# Run migration (production)
wrangler d1 execute cibc-db --file=migrations/001_initial_schema.sql
```

#### Task 1.3: Setup R2 Bucket
```bash
# Create bucket
wrangler r2 bucket create cibc-storage

# Configure in wrangler.toml
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "cibc-storage"
```

#### Task 1.4: Project Structure
```
src/
├── index.ts                    # Worker entry point
├── config/
│   ├── database.ts             # D1 connection
│   ├── env.ts                  # Env validation
│   └── constants.ts            # App constants
├── middleware/
│   ├── auth.middleware.ts      # JWT verification
│   ├── cors.middleware.ts      # CORS
│   ├── rateLimit.middleware.ts # Rate limiting
│   └── error.middleware.ts     # Error handler
├── controllers/
│   ├── auth.controller.ts
│   ├── competition.controller.ts
│   └── ...
├── services/
│   ├── auth.service.ts
│   ├── competition.service.ts
│   └── ...
├── utils/
│   ├── jwt.ts
│   ├── password.ts
│   ├── validation.ts
│   └── response.ts
└── types/
    ├── api.ts
    └── database.ts
```

---

### DAY 3-4: Authentication System

#### Task 2.1: Auth Service
**File:** `src/services/auth.service.ts`

**Functions:**
```typescript
export class AuthService {
  constructor(private db: Database) {}

  async register(userData: RegisterInput): Promise<User>;
  async login(email: string, password: string): Promise<LoginResult>;
  async logout(userId: string): Promise<void>;
  async refreshToken(refreshToken: string): Promise<TokenPair>;
  async setCompetitionContext(userId: string, competitionId: string): Promise<TokenPair>;
}
```

**Implementation:**
- Password hashing dengan bcrypt
- JWT generation (access + refresh)
- Token validation
- Competition context switching

#### Task 2.2: Auth Controller
**File:** `src/controllers/auth.controller.ts`

**Endpoints:**
```typescript
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
POST /api/v1/admin/auth/context
GET  /api/v1/auth/me
```

#### Task 2.3: Auth Middleware
**File:** `src/middleware/auth.middleware.ts`

**Functions:**
```typescript
export async function authMiddleware(request: Request): Promise<User | null>;
export async function requireRole(roles: string[]): Middleware;
export async function requirePermission(permission: string): Middleware;
```

#### Task 2.4: JWT Utilities
**File:** `src/utils/jwt.ts`

**Functions:**
```typescript
export function generateAccessToken(payload: AccessTokenPayload): string;
export function generateRefreshToken(userId: string): string;
export function verifyAccessToken(token: string): AccessTokenPayload;
export function verifyRefreshToken(token: string): RefreshTokenPayload;
```

---

### DAY 5-6: Competition Management

#### Task 3.1: Competition Service
**File:** `src/services/competition.service.ts`

**Methods:**
```typescript
export class CompetitionService {
  constructor(private db: Database) {}

  async getAll(filters: CompetitionFilters): Promise<Competition[]>;
  async getById(id: string): Promise<Competition | null>;
  async create(data: CreateCompetitionInput): Promise<Competition>;
  async update(id: string, data: UpdateCompetitionInput): Promise<Competition>;
  async delete(id: string): Promise<void>;
}
```

#### Task 3.2: Competition Controller
**File:** `src/controllers/competition.controller.ts`

**Endpoints:**
```typescript
GET    /api/v1/admin/competitions
POST   /api/v1/admin/competitions
GET    /api/v1/admin/competitions/:id
PATCH  /api/v1/admin/competitions/:id
DELETE /api/v1/admin/competitions/:id
```

#### Task 3.3: Seed Default Competition
**File:** `migrations/002_seed_data.sql`

```sql
-- Insert default admin user
INSERT INTO users (id, email, password_hash, name)
VALUES ('user_001', 'admin@kathevent.com', '$2a$10$...', 'Super Admin');

-- Insert CIBC 2026 competition
INSERT INTO competitions (id, code, name, status, registration_start, registration_end)
VALUES ('comp_cibc_2026', 'cibc-2026', 'CIBC Power by KATH 2026', 'upcoming', ...);

-- Assign admin role
INSERT INTO user_roles (user_id, competition_id, role)
VALUES ('user_001', 'comp_cibc_2026', 'super_admin');
```

---

### DAY 7: Stages & Tasks

#### Task 4.1: Stage Service
**File:** `src/services/stage.service.ts`

**Methods:**
```typescript
export class StageService {
  async getAll(competitionId: string): Promise<Stage[]>;
  async create(data: CreateStageInput): Promise<Stage>;
  async update(id: string, data: UpdateStageInput): Promise<Stage>;
  async activate(id: string): Promise<Stage>;
  async delete(id: string): Promise<void>;
}
```

#### Task 4.2: Task Service
**File:** `src/services/task.service.ts`

**Methods:**
```typescript
export class TaskService {
  async getAll(stageId: string): Promise<Task[]>;
  async create(data: CreateTaskInput): Promise<Task>;
  async update(id: string, data: UpdateTaskInput): Promise<Task>;
  async publish(id: string): Promise<Task>;
  async unpublish(id: string): Promise<Task>;
  async delete(id: string): Promise<void>;
}
```

---

### DAY 8-9: Teams & Submissions

#### Task 5.1: Team Service
**File:** `src/services/team.service.ts`

#### Task 5.2: Submission Service
**File:** `src/services/submission.service.ts`

#### Task 5.3: Storage Service (R2)
**File:** `src/services/storage.service.ts`

**Methods:**
```typescript
export class StorageService {
  constructor(private r2: R2Bucket) {}

  async generatePresignedUploadUrl(
    filename: string,
    contentType: string,
    size: number
  ): Promise<PresignedUrl>;

  async getDownloadUrl(key: string, expireMinutes?: number): Promise<string>;
  async deleteFile(key: string): Promise<void>;
  async uploadFile(key: string, body: ReadableStream): Promise<R2Object>;
}
```

---

### DAY 10: Testing & Documentation

#### Task 6.1: Write Tests
```bash
# Setup Vitest
npm install -D vitest @cloudflare/vitest-pool-workers

# Create test files
tests/
├── auth.service.test.ts
├── competition.service.test.ts
└── ...

# Run tests
npm run test
```

#### Task 6.2: API Documentation
- Document all endpoints
- Include request/response examples
- Document error codes

#### Task 6.3: Deployment Guide
- Write deployment instructions
- Environment variables setup
- Database migration guide

---

## 🔐 Security Requirements

### 1. Password Security
```typescript
// Minimum 8 characters
// Hash dengan bcrypt (cost 10)
// Never store plain text
```

### 2. Input Validation
```typescript
// Use Zod for all input validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

### 3. Rate Limiting
```typescript
// Auth endpoints: 5 req/minute
// Admin endpoints: 100 req/minute
// Upload endpoints: 10 req/minute
```

### 4. CORS
```typescript
// Allow only frontend domain
const allowedOrigins = ['https://kathevent.com'];
```

### 5. SQL Injection Prevention
```typescript
// ALWAYS use parameterized queries
const user = await db.first(
  'SELECT * FROM users WHERE email = ?',
  [email]
);
```

---

## 📊 Response Format Standard

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

---

## ✅ Deliverables Checklist

### Code
- [ ] Project structure lengkap
- [ ] 11 database tables created
- [ ] 55 API endpoints implemented
- [ ] Authentication system working
- [ ] Multi-tenancy implemented
- [ ] File upload working (R2)
- [ ] Error handling comprehensive
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] CORS configured

### Testing
- [ ] Unit tests untuk services
- [ ] Integration tests untuk endpoints
- [ ] Auth flow tested end-to-end
- [ ] File upload tested
- [ ] Multi-tenancy isolation tested

### Documentation
- [ ] API documentation lengkap
- [ ] Database schema documented
- [ ] Environment variables documented
- [ ] Deployment guide written
- [ ] Testing instructions provided

### Deployment
- [ ] Deployed to Cloudflare Workers
- [ ] D1 database configured
- [ ] R2 bucket configured
- [ ] Environment variables set
- [ ] Health check passing

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Login dengan credentials benar → success
- [ ] Login dengan credentials salah → error
- [ ] Access token expired → auto refresh
- [ ] Refresh token expired → re-login required
- [ ] Logout → tokens invalidated
- [ ] Set competition context → new token dengan scope

### Multi-Tenancy
- [ ] Admin A tidak bisa akses data kompetisi B
- [ ] Judge hanya bisa grade kompetisi assigned
- [ ] Observer hanya read-only
- [ ] Switch competition context → data berubah

### File Upload
- [ ] Generate presigned URL → valid 1 jam
- [ ] Upload file < max size → success
- [ ] Upload file > max size → error
- [ ] Upload file type tidak sesuai → error
- [ ] Download dengan presigned URL → success

### Competition Management
- [ ] Create competition → success
- [ ] Update competition → data berubah
- [ ] Delete competition dengan teams → error
- [ ] List competitions dengan filter → correct

---

## 💾 Environment Variables

```env
# .dev.vars (local development)
DATABASE_ID=d1_database_id
R2_BUCKET_NAME=cibc-storage
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# .env.production (production)
DATABASE_ID=production_d1_id
R2_BUCKET_NAME=cibc-storage-prod
JWT_SECRET=secure-random-secret
FRONTEND_URL=https://kathevent.com
ADMIN_URL=https://admin.kathevent.com
```

---

## 🚀 Deployment Steps

### 1. Local Development
```bash
cd /Users/mekari/kath-backend/cibc-admin-backend

# Install dependencies
npm install

# Setup D1 local
wrangler d1 create cibc-db --local
wrangler d1 execute cibc-db --local --file=migrations/001_initial_schema.sql

# Start dev server
npm run dev
```

### 2. Production Deployment
```bash
# Setup production D1
wrangler d1 create cibc-db
wrangler d1 execute cibc-db --file=migrations/001_initial_schema.sql

# Setup R2
wrangler r2 bucket create cibc-storage

# Deploy
wrangler deploy

# Verify deployment
curl https://cibc-admin-backend.<your-subdomain>.workers.dev/api/v1/admin/health
```

---

## 📞 Support Resources

### Documentation
- `BACKEND_ADMIN_DASHBOARD_ARCHITECTURE.md` - Architecture overview
- `BACKEND_DETAILED_SPECIFICATION.md` - Detailed specs
- `BACKEND_IMPLEMENTATION_ROADMAP.md` - Implementation plan
- `FRONTEND_INTEGRATION_GUIDE.md` - FE integration

### Commands
```bash
# Local development
npm run dev

# Run migrations
wrangler d1 execute cibc-db --local --file=migrations/001_initial_schema.sql

# Deploy
wrangler deploy

# View logs
wrangler tail
```

---

## 🎯 Success Criteria

Your output is successful if:

✅ All 55 endpoints working correctly  
✅ Authentication secure (bcrypt + JWT)  
✅ Multi-tenancy properly isolated  
✅ File upload working (R2 presigned URLs)  
✅ Input validation on all endpoints  
✅ Error handling comprehensive  
✅ Rate limiting configured  
✅ CORS configured  
✅ Tests passing  
✅ Documentation complete  
✅ Deployed and accessible  

---

**Start dengan:**
1. Baca semua dokumentasi reference
2. Setup project structure
3. Create database & run migrations
4. Implement authentication first
5. Test auth flow end-to-end
6. Lanjut ke competition management
7. Deploy & verify

**Good luck! Build a production-ready backend!** 🚀
