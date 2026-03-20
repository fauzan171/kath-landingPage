# 🔄 Backend Overhaul - Supabase + Google Drive + n8n Integration

## 📋 Overview & Context

**Project:** CIBC Power by KATH - Competition Management Platform  
**Type:** Backend Architecture Overhaul  
**Stack:** Supabase (PostgreSQL) + Google Drive (Storage) + n8n (Automation)  
**Goal:** Zero-cost storage solution dengan hybrid architecture  

---

## 🎯 Mission Objective

Anda akan **merombak total backend architecture** dari rencana awal (Cloudflare Workers + D1 + R2) menjadi:

```
NEW ARCHITECTURE:
├── Database: Supabase PostgreSQL (FREE 500MB)
├── Storage: Google Drive (FREE 15GB via n8n)
├── Automation: n8n Workflow (Self-hosted FREE)
├── Frontend: Cloudflare Pages (existing, tetap)
└── Cost: $0/month ✅
```

---

## 📖 Required Reading (WAJIB BACA!)

### Existing Documentation
1. `/Users/mekari/kath-laddingpage/CIBC_COMPETITION_FLOW.md`
   - Competition flow & timeline
   - Submission requirements

2. `/Users/mekari/kath-laddingpage/docs/backend-spec/BACKEND_ADMIN_DASHBOARD_ARCHITECTURE.md`
   - Original architecture (for reference)
   - Database schema design

3. `/Users/mekari/kath-laddingpage/docs/backend-spec/BACKEND_DETAILED_SPECIFICATION.md`
   - Detailed database schema (11 tables)
   - API endpoint specifications

4. `/Users/mekari/kath-laddingpage/docs/backend-spec/BACKEND_IMPLEMENTATION_ROADMAP.md`
   - Implementation phases
   - Testing checklist

### New Architecture Reference
5. `/Users/mekari/kath-laddingpage/AGENT_COLLABORATION.md`
   - BMC Consultant recommendations
   - Flow competition internasional

---

## 🏗️ New Architecture Decision

### WHY This Architecture?

**Problem:**
```
❌ Cloudflare R2 butuh credit card untuk enable
❌ User gak punya credit card
❌ Butuh solusi FREE 100%
```

**Solution:**
```
✅ Supabase FREE: 500MB database (cukup untuk metadata)
✅ Google Drive FREE: 15GB storage (cukup untuk 3,000 PDF @ 5MB)
✅ n8n FREE: Self-hosted automation (Railway/Render)
✅ Total: $0/month
```

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    HYBRID STORAGE FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User Upload PDF (5MB)                                        │
│     ↓                                                            │
│  2. Frontend call n8n Webhook                                    │
│     ↓                                                            │
│  3. n8n Workflow:                                                │
│     - Receive PDF                                                │
│     - Upload to Google Drive                                     │
│     - Set public permission                                      │
│     - Return shareable link                                      │
│     ↓                                                            │
│  4. Save to Supabase DB:                                         │
│     {                                                            │
│       "file_url": "https://drive.google.com/...",  ← 100 bytes  │
│       "file_size": 5242880,                         ← 8 bytes   │
│       "file_name": "bmc.pdf"                        ← 20 bytes  │
│     }                                                            │
│     ↓                                                            │
│  5. RESULT:                                                      │
│     - DB storage: ~200 bytes per submission ✅                   │
│     - Google Drive: 5MB actual file ✅                           │
│     - Cost: $0/month ✅                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Tasks

### PHASE 1: Setup Supabase (Day 1)

#### Task 1.1: Register & Create Project

```bash
# 1. Register di https://supabase.com
#    - Sign up dengan GitHub
#    - Verify email
#    - No credit card needed!

# 2. Create new project:
#    - Name: cibc-backend
#    - Database password: (STRONG - SAVE INI!)
#    - Region: Singapore (closest)
#    - Wait 2-3 minutes untuk provisioning
```

#### Task 1.2: Get Credentials

```
Supabase Dashboard → Settings → API

Copy:
- Project URL: https://xxxxx.supabase.co
- Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (RAHASIA!)
```

#### Task 1.3: Setup Database Schema

**File:** `database-schema.sql`

```sql
-- Copy schema dari BACKEND_DETAILED_SPECIFICATION.md
-- Paste ke Supabase SQL Editor
-- Run semua 11 tables

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. USER ROLES TABLE
-- ... (copy semua tables dari spec)

-- INDEXES
-- ... (copy semua indexes)

-- SEED DATA
-- Insert default admin user
-- Insert CIBC 2026 competition
```

**Action:**
```
1. Supabase Dashboard → SQL Editor
2. Paste schema SQL
3. Run (tombol "Run")
4. Verify 11 tables created
5. Check table row count
```

#### Task 1.4: Setup Row Level Security (RLS)

```sql
-- Enable RLS untuk semua tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
-- ... untuk semua tables

-- Policy: Authenticated users can read
CREATE POLICY "Allow authenticated read"
ON submissions FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy: Admins can insert/update/delete
CREATE POLICY "Allow admin write"
ON submissions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('super_admin', 'admin')
  )
);
```

---

### PHASE 2: Setup Google Drive + n8n (Day 2)

#### Task 2.1: Setup Google Cloud Project

```bash
# 1. Buka https://console.cloud.google.com
# 2. Login dengan Google account
# 3. Create new project: "cibc-storage"
# 4. Note Project ID
```

#### Task 2.2: Enable Google Drive API

```
Google Cloud Console
↓
APIs & Services → Library
↓
Search: "Google Drive API"
↓
Click "Enable"
```

#### Task 2.3: Create Service Account

```
APIs & Services → Credentials
↓
Create Credentials → Service Account
↓
Service account name: cibc-uploader
↓
Grant access:
- Role: Drive API → Drive File Access
↓
Create and continue
↓
Manage keys → Add key → Create new key
↓
Key type: JSON
↓
Download → Save as `google-credentials.json`
```

**Save file ini untuk nanti!**

#### Task 2.4: Create & Share Google Drive Folder

```bash
# 1. Buka https://drive.google.com
# 2. Create folder: "CIBC Submissions"
# 3. Copy Folder ID dari URL:
#    https://drive.google.com/drive/folders/1ABC123...
#    Folder ID: 1ABC123...

# 4. Share folder ke service account email:
#    - Click "Share"
#    - Enter: cibc-uploader@xxxxx.iam.gserviceaccount.com
#    - Permission: Editor
#    - Done
```

#### Task 2.5: Setup n8n (Self-Hosted)

**Option A: Railway (RECOMMENDED)**

```bash
# 1. Register https://railway.app (no CC needed)
# 2. New Project → Deploy from GitHub
# 3. Repo: https://github.com/n8n-io/n8n
# 4. Deploy

# 5. Add environment variables:
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
WEBHOOK_URL=https://your-n8n.up.railway.app

# 6. Get n8n URL:
#    https://n8n-xxxx.up.railway.app
```

**Option B: Render**

```bash
# 1. Register https://render.com (no CC needed)
# 2. New Web Service
# 3. Connect GitHub: n8n-io/n8n
# 4. Deploy

# Environment:
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
```

#### Task 2.6: Create n8n Workflow

**Import JSON ke n8n:**

```json
{
  "name": "CIBC PDF to Google Drive",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "upload-pdf",
        "responseMode": "lastNode",
        "rawBody": true
      },
      "id": "webhook",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "operation": "upload",
        "binaryPropertyName": "={{ $input.first().binary }}",
        "options": {
          "parent": {
            "__rl": true,
            "mode": "id",
            "id": "YOUR_DRIVE_FOLDER_ID"
          }
        }
      },
      "id": "gdrive",
      "name": "Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [450, 300],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "YOUR_CRED_ID",
          "name": "Google Drive OAuth"
        }
      }
    },
    {
      "parameters": {
        "operation": "share",
        "fileId": "={{ $json.id }}",
        "role": "reader",
        "type": "anyone"
      },
      "id": "permission",
      "name": "Set Public",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [650, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "fileUrl",
              "value": "={{ `https://drive.google.com/file/d/${$json.id}/view` }}"
            },
            {
              "name": "fileName",
              "value": "={{ $json.name }}"
            },
            {
              "name": "fileSize",
              "value": "={{ $json.size }}"
            }
          ]
        }
      },
      "id": "format",
      "name": "Format Response",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [850, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Google Drive", "type": "main", "index": 0 }]]
    },
    "Google Drive": {
      "main": [[{ "node": "Set Public", "type": "main", "index": 0 }]]
    },
    "Set Public": {
      "main": [[{ "node": "Format Response", "type": "main", "index": 0 }]]
    }
  },
  "active": true
}
```

**Setup Credentials:**
```
1. Click "Google Drive OAuth"
2. Connect OAuth Account
3. Login Google account
4. Authorize
5. Done
```

**Test:**
```bash
curl -X POST https://your-n8n-url/webhook/upload-pdf \
  -F "file=@test.pdf"

# Expected:
{
  "fileUrl": "https://drive.google.com/file/d/1ABC.../view",
  "fileName": "test.pdf",
  "fileSize": 123456
}
```

---

### PHASE 3: Update Frontend Integration (Day 3)

#### Task 3.1: Install Supabase Client

```bash
cd /Users/mekari/kath-laddingpage
npm install @supabase/supabase-js
```

#### Task 3.2: Setup Environment Variables

**File:** `.env`

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# n8n Webhook
VITE_N8N_WEBHOOK_URL=https://your-n8n.up.railway.app

# App
VITE_APP_NAME="CIBC Power by KATH"
VITE_APP_URL="http://localhost:3001"
```

#### Task 3.3: Create Supabase Client

**File:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types
export type User = {
  id: string;
  email: string;
  name: string;
  role?: string;
};

export type Submission = {
  id: string;
  task_id: string;
  team_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  status: string;
  submitted_at: string;
};
```

#### Task 3.4: Update Submission Service

**File:** `src/services/submission.service.ts`

```typescript
import { supabase } from '@/lib/supabase';

const N8N_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK_URL;

export async function submitPDF(
  taskId: string,
  teamId: string,
  pdfFile: File
) {
  try {
    // 1. Upload PDF ke n8n webhook
    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('taskId', taskId);
    formData.append('teamId', teamId);

    const response = await fetch(`${N8N_WEBHOOK}/upload-pdf`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const { fileUrl, fileName, fileSize } = await response.json();

    // 2. Save metadata ke Supabase DB (URL STRING AJA!)
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        task_id: taskId,
        team_id: teamId,
        file_url: fileUrl, // ← Google Drive URL (100 bytes)
        file_name: fileName,
        file_size: fileSize,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0],
      message: 'Submission successful',
    };
  } catch (error) {
    console.error('Submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}
```

#### Task 3.5: Update Auth Service

**File:** `src/services/auth.service.ts`

```typescript
import { supabase } from '@/lib/supabase';

export async function login(email: string, password: string) {
  try {
    // 1. Login via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // 2. Get user role from database
    const { data: userData } = await supabase
      .from('user_roles')
      .select('role, competition_id')
      .eq('user_id', data.user.id);

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: userData?.[0]?.role || 'user',
      },
      competitions: userData || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

export async function register(userData: any) {
  try {
    // 1. Register via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.fullName,
          phone: userData.phone,
        },
      },
    });

    if (error) throw error;

    // 2. Insert user details ke database
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user?.id,
        email: userData.email,
        password_hash: 'handled_by_supabase',
        name: userData.fullName,
        phone: userData.phone,
      });

    if (insertError) throw insertError;

    return {
      success: true,
      message: 'Registration successful',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}
```

---

### PHASE 4: Testing & Validation (Day 4)

#### Task 4.1: Test Database Connection

```typescript
// Test file: src/tests/supabase.test.ts
import { supabase } from '@/lib/supabase';

describe('Supabase Connection', () => {
  it('should connect to database', async () => {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
```

#### Task 4.2: Test Upload Flow

```typescript
// Test upload
const testFile = new File(['test content'], 'test.pdf', {
  type: 'application/pdf',
});

const result = await submitPDF(
  'task_001',
  'team_001',
  testFile
);

console.log(result);
// Expected: { success: true, data: {...} }
```

#### Task 4.3: Test End-to-End

```
Test Scenario:
1. User login → ✅
2. User navigate to submission page → ✅
3. User upload PDF → ✅
4. PDF uploaded to Google Drive → ✅
5. URL saved to Supabase DB → ✅
6. User can view submission → ✅
7. Admin can grade submission → ✅
```

---

### PHASE 5: Deployment (Day 5)

#### Task 5.1: Deploy Frontend to Cloudflare Pages

```bash
cd /Users/mekari/kath-laddingpage

# Build
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist/

# Get URL
# https://kath-laddingpage.pages.dev
```

#### Task 5.2: Verify Production

```
Production Checklist:
[ ] Frontend accessible
[ ] Login works
[ ] Upload PDF works
[ ] Google Drive upload works
[ ] Database save works
[ ] URLs accessible
[ ] Admin dashboard works
```

---

## 📊 Database Schema Reference

**Copy dari BACKEND_DETAILED_SPECIFICATION.md:**

```sql
-- 11 TABLES:
-- 1. users
-- 2. user_roles
-- 3. competitions
-- 4. stages
-- 5. tasks
-- 6. teams
-- 7. team_members
-- 8. submissions
-- 9. announcements
-- 10. notifications
-- 11. audit_logs

-- See BACKEND_DETAILED_SPECIFICATION.md for full schema
```

---

## 🔐 Security Considerations

### 1. Google Drive Permissions

```
✅ Service account has access to folder
✅ Folder shared to service account
✅ Files set to "anyone with link can view"
✅ No write access for users
```

### 2. Database RLS

```
✅ All tables have RLS enabled
✅ Authenticated users can read own data
✅ Admins can write
✅ Public cannot access
```

### 3. n8n Webhook Security

```
✅ HTTPS only
✅ Validate file type (PDF only)
✅ Validate file size (max 10MB)
✅ Rate limiting (100 req/hour per IP)
```

---

## 💰 Cost Breakdown

| Service | FREE Tier | Usage | Cost |
|---------|-----------|-------|------|
| Supabase DB | 500MB | ~1MB | $0 |
| Supabase Auth | 50k MAU | ~500 users | $0 |
| Google Drive | 15GB | ~2.5GB (500 PDF) | $0 |
| n8n (Railway) | FREE | Self-hosted | $0 |
| Cloudflare Pages | 100k req/day | ~5k/day | $0 |
| **TOTAL** | | | **$0/month** ✅ |

---

## ✅ Deliverables Checklist

### Database
- [ ] 11 tables created in Supabase
- [ ] RLS policies configured
- [ ] Indexes created
- [ ] Seed data inserted

### Google Drive
- [ ] Google Cloud project created
- [ ] Drive API enabled
- [ ] Service account created
- [ ] Folder created & shared
- [ ] Credentials saved

### n8n
- [ ] n8n deployed (Railway/Render)
- [ ] Workflow imported
- [ ] Google Drive credentials connected
- [ ] Webhook tested
- [ ] Response format correct

### Frontend
- [ ] Supabase client installed
- [ ] Environment variables set
- [ ] Submission service updated
- [ ] Auth service updated
- [ ] Upload flow tested

### Testing
- [ ] Login flow works
- [ ] Upload PDF works
- [ ] Google Drive upload works
- [ ] Database save works
- [ ] URLs accessible
- [ ] Admin grading works

### Deployment
- [ ] Frontend deployed to Cloudflare
- [ ] Production URL verified
- [ ] All features working
- [ ] Monitoring setup

---

## 🆘 Troubleshooting

### Issue: n8n webhook 404
```bash
# Check:
# 1. Workflow active? (green toggle)
# 2. Webhook path: /upload-pdf
# 3. n8n server running?
# 4. Railway deployment successful?
```

### Issue: Google Drive permission denied
```bash
# Check:
# 1. Service account email shared to folder?
# 2. OAuth credentials valid in n8n?
# 3. Folder ID correct in workflow?
```

### Issue: Supabase RLS error
```bash
# Check:
# 1. RLS policies correct?
# 2. User authenticated?
# 3. Using anon key correctly?
```

---

## 🎯 Success Criteria

Your output is successful if:

✅ Supabase database created dengan 11 tables  
✅ Google Drive folder ready untuk upload  
✅ n8n workflow working (upload → Drive → URL)  
✅ Frontend dapat upload PDF  
✅ URL tersimpan di database (bukan binary)  
✅ Total cost: $0/month  
✅ All tests passing  
✅ Production deployed  

---

## 📞 Next Steps

After this overhaul complete:

1. **Admin Dashboard** - Build admin UI untuk grading
2. **Monitoring** - Setup usage monitoring
3. **Scale** - Prepare for multiple competitions
4. **Backup** - Setup automated backup

---

**Start dengan:**
1. Baca semua dokumentasi reference
2. Setup Supabase project
3. Setup Google Cloud + Drive
4. Deploy n8n workflow
5. Update frontend integration
6. Test end-to-end
7. Deploy production

**Good luck! Build a zero-cost scalable backend!** 🚀
