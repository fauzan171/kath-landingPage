# CIBC Admin Dashboard - Setup Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│                    Deployed on: Vercel/Netlify                  │
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

**Total Cost: $0/month** ✨

---

## Step 1: Setup Supabase Project

### 1.1 Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email

### 1.2 Create New Project

1. Click "New Project"
2. Fill in details:
   - **Name:** `cibc-admin-dashboard`
   - **Database Password:** (save this securely!)
   - **Region:** Singapore (closest to Indonesia)
3. Wait for project to be created (~2 minutes)

### 1.3 Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** (long string starting with `eyJ...`)

### 1.4 Setup Database Schema

1. Go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute

### 1.5 Insert Seed Data

1. In SQL Editor, create a new query
2. Copy and paste the contents of `supabase/seed.sql`
3. Click **Run** to execute

### 1.6 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - ✅ Enable email confirmations (optional for development)
   - ✅ Enable secure email change

### 1.7 Setup Row Level Security

The schema.sql already includes RLS policies, but verify:

1. Go to **Authentication** → **Policies**
2. Confirm policies are active for each table

---

## Step 2: Setup Google Cloud & Drive

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project:
   - **Project name:** `cibc-file-storage`
   - **Project ID:** (auto-generated or custom)

### 2.2 Enable Google Drive API

1. Go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### 2.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure consent screen first if prompted:
   - User Type: **External**
   - App name: `CIBC File Upload`
   - User support email: your email
   - Developer contact: your email
4. Create OAuth client:
   - Application type: **Web application**
   - Name: `n8n Google Drive`
   - Authorized redirect URIs:
     - `https://your-n8n-instance.com/rest/oauth2-credential/callback`
     - (add this after deploying n8n)

### 2.4 Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create folder: `CIBC Submissions`
3. Get folder ID from URL:
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID`
   - Copy the `FOLDER_ID` part

---

## Step 3: Deploy n8n Workflow

### Option A: n8n.cloud (Easiest - Recommended for beginners)

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for free tier
3. Create new workflow
4. Import `n8n/cibc-upload-workflow.json`
5. Configure Google Drive credentials:
   - Click on Google Drive node
   - Add credential → Sign in with Google
   - Authorize access
6. Update folder ID in workflow:
   - Open "Upload to Google Drive" node
   - Replace `YOUR_GOOGLE_DRIVE_FOLDER_ID` with your folder ID
7. Activate the workflow
8. Copy webhook URL

### Option B: Self-hosted on Railway

1. Go to [Railway](https://railway.app)
2. Sign in with GitHub
3. Click **New Project** → **Deploy from template**
4. Search for "n8n" template
5. Configure environment:
   ```bash
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=your-secure-password
   WEBHOOK_URL=https://your-app.railway.app
   ```
6. Deploy
7. Access n8n at your Railway URL
8. Import workflow and configure as above

### Option C: Self-hosted on Render

1. Go to [Render](https://render.com)
2. Create new **Web Service**
3. Use Docker image: `n8nio/n8n`
4. Configure:
   ```yaml
   envVars:
     - key: N8N_BASIC_AUTH_ACTIVE
       value: true
     - key: N8N_BASIC_AUTH_USER
       value: admin
     - key: N8N_BASIC_AUTH_PASSWORD
       generateValue: true
     - key: WEBHOOK_URL
       value: https://your-app.onrender.com
   ```
5. Deploy

### Configure n8n Workflow

After deploying n8n:

1. Open workflow editor
2. Import `n8n/cibc-upload-workflow.json`
3. Configure each node:

   **Webhook Node:**
   - Authentication: None (or add auth for security)
   - HTTP Method: POST
   - Path: `upload-pdf`

   **Validate File Node:**
   - Already configured for PDF < 10MB
   - Modify conditions if needed

   **Upload to Google Drive Node:**
   - Add Google Drive credentials
   - Set folder ID
   - Enable "Use file name"

   **Set Public Permission Node:**
   - Role: Reader
   - Type: Anyone

4. Save and **Activate** workflow
5. Copy webhook URL from Webhook node

---

## Step 4: Configure Frontend

### 4.1 Set Environment Variables

Create `.env` file in project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env`:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# n8n Webhook
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# App
VITE_APP_NAME=CIBC Admin Dashboard
VITE_APP_URL=http://localhost:5173
```

### 4.2 Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 4.3 Verify Configuration

```bash
npm run dev
```

Open browser console and check for errors.

---

## Step 5: Test End-to-End Flow

### 5.1 Test Authentication

1. Open app at `http://localhost:5173`
2. Go to login/register page
3. Create test account
4. Verify email if confirmation enabled
5. Login successfully

### 5.2 Test File Upload

1. Navigate to a task with file upload
2. Select a PDF file (< 10MB)
3. Upload
4. Verify:
   - File appears in Google Drive folder
   - Submission record in Supabase
   - File URL is accessible

### 5.3 Test Database Operations

Use Supabase Dashboard → Table Editor to verify:
- Users created correctly
- Competitions visible
- Stages and tasks loaded
- Submissions stored with correct metadata

---

## Step 6: Deploy to Production

### 6.1 Deploy Frontend (Vercel - Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

Or use Netlify:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### 6.2 Update n8n Webhook CORS

In n8n workflow, add response headers:
```json
{
  "headers": {
    "Access-Control-Allow-Origin": "https://your-app.vercel.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  }
}
```

### 6.3 Update Supabase Settings

1. Go to Authentication → URL Configuration
2. Add your production URL to:
   - Site URL
   - Redirect URLs

### 6.4 Security Checklist

- [ ] Never commit `.env` file
- [ ] Use environment variables in production
- [ ] Enable RLS policies verified
- [ ] Google Drive folder permissions correct
- [ ] n8n webhook has proper CORS
- [ ] Supabase API keys are anon key only (not service_role)

---

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists
- Verify variable names start with `VITE_`
- Restart dev server after changing `.env`

### "Failed to upload file"
- Check n8n webhook URL is correct
- Verify Google Drive credentials in n8n
- Check file is PDF and < 10MB
- Check browser console for CORS errors

### "Permission denied" on database
- Verify RLS policies are correct
- Check user is authenticated
- Use Supabase SQL Editor to test queries

### n8n workflow not triggering
- Verify workflow is activated
- Check webhook URL matches
- Test webhook with curl:
  ```bash
  curl -X POST https://your-n8n.com/webhook/upload-pdf \
    -F "file=@test.pdf" \
    -F "taskId=test" \
    -F "teamId=test"
  ```

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **n8n Docs:** https://docs.n8n.io
- **Google Drive API:** https://developers.google.com/drive

---

## Architecture Benefits

| Feature | Solution | Cost |
|---------|----------|------|
| Database | Supabase PostgreSQL | FREE (500MB) |
| File Storage | Google Drive | FREE (15GB) |
| Automation | n8n Workflow | FREE |
| Frontend Hosting | Vercel | FREE |
| **Total** | | **$0/month** |

### Storage Math

- **Database:** ~200 bytes per submission metadata
- **With 500MB:** ~2.7 million submissions
- **Files:** ~5MB average PDF × 3,000 = 15GB

Perfect for competition scale! 🎉