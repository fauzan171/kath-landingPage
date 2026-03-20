# 🔄 Backend Overhaul Prompts

Complete prompts untuk merombak backend architecture dari Cloudflare Workers + D1 + R2 menjadi **Supabase + Google Drive + n8n**.

---

## 🎯 Quick Start

### Option 1: Full Overhaul (Recommended)

```bash
cd /Users/mekari/kath-laddingpage

# Run complete overhaul prompt
qwen-agent --prompt prompts/backend/backend-overhaul-supabase-gdrive.md
```

### Option 2: Step-by-Step

```bash
# Phase 1: Setup Supabase
qwen-agent --prompt prompts/backend/01-supabase-setup.md

# Phase 2: Setup Google Drive + n8n
qwen-agent --prompt prompts/backend/02-gdrive-n8n-setup.md

# Phase 3: Frontend Integration
qwen-agent --prompt prompts/backend/03-frontend-integration.md

# Phase 4: Testing
qwen-agent --prompt prompts/backend/04-testing-validation.md

# Phase 5: Deployment
qwen-agent --prompt prompts/backend/05-deployment.md
```

---

## 📁 Available Prompts

| Prompt | Purpose | Status |
|--------|---------|--------|
| `backend-overhaul-supabase-gdrive.md` | Complete overhaul (all-in-one) | ✅ Ready |
| `backend-implementation.md` | Original Cloudflare backend (for reference) | ✅ Ready |

---

## 🏗️ Architecture Overview

### OLD Architecture (Not Used)
```
Cloudflare Workers + D1 + R2
❌ Need credit card for R2
❌ Complex setup
```

### NEW Architecture (Recommended)
```
┌─────────────────────────────────────────┐
│         HYBRID ARCHITECTURE              │
├─────────────────────────────────────────┤
│                                          │
│  Frontend: Cloudflare Pages (existing)  │
│              ↓                           │
│  Backend: Supabase PostgreSQL           │
│  - Database: 500MB FREE                 │
│  - Auth: 50k MAU FREE                   │
│              ↓                           │
│  Storage: Google Drive via n8n          │
│  - 15GB FREE                            │
│  - Auto upload via webhook              │
│  - Share link saved to DB               │
│                                          │
│  Cost: $0/month ✅                       │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🚀 What You'll Get

After running the prompt:

### Database (Supabase)
```
✅ 11 tables created
✅ RLS policies configured
✅ Indexes for performance
✅ Seed data inserted
✅ Cost: $0/month (500MB FREE)
```

### Storage (Google Drive)
```
✅ 15GB FREE storage
✅ Auto upload via n8n
✅ Public share links
✅ Virus scan by Google
✅ Cost: $0/month
```

### Automation (n8n)
```
✅ Self-hosted on Railway/Render
✅ PDF upload workflow
✅ Google Drive integration
✅ Response formatting
✅ Cost: $0/month (FREE tier)
```

### Frontend Integration
```
✅ Supabase client setup
✅ Upload service updated
✅ Auth service updated
✅ Environment variables
✅ Cost: $0/month (Cloudflare FREE)
```

---

## 💰 Cost Breakdown

| Service | FREE Tier | Estimated Usage | Cost |
|---------|-----------|-----------------|------|
| Supabase DB | 500MB | ~1MB | $0 |
| Supabase Auth | 50k MAU | ~500 users | $0 |
| Google Drive | 15GB | ~2.5GB (500 PDF) | $0 |
| n8n (Railway) | FREE | Self-hosted | $0 |
| Cloudflare Pages | 100k req/day | ~5k/day | $0 |
| **TOTAL** | | | **$0/month** ✅ |

---

## 📊 Implementation Timeline

| Phase | Task | Duration |
|-------|------|----------|
| **Phase 1** | Setup Supabase | Day 1 |
| **Phase 2** | Setup Google Drive + n8n | Day 2 |
| **Phase 3** | Frontend Integration | Day 3 |
| **Phase 4** | Testing & Validation | Day 4 |
| **Phase 5** | Deployment | Day 5 |
| **Total** | | **5 days** |

---

## ✅ Success Criteria

After implementation:

```
✅ Supabase database working
✅ Google Drive upload working
✅ n8n workflow running
✅ Frontend can upload PDF
✅ URL saved to database (not binary)
✅ All tests passing
✅ Production deployed
✅ Cost: $0/month
```

---

## 🆘 Troubleshooting

### Issue: Prompt tidak jalan
```bash
# Check:
# 1. File exists: ls -la prompts/backend/
# 2. Agent installed: qwen-agent --version
# 3. Try manual: cat prompt.md | pbcopy → paste ke AI
```

### Issue: Google Drive permission denied
```bash
# Check:
# 1. Service account email shared to folder?
# 2. OAuth credentials valid in n8n?
# 3. Folder ID correct?
```

### Issue: n8n webhook 404
```bash
# Check:
# 1. Workflow active? (green toggle)
# 2. Webhook path: /upload-pdf
# 3. n8n server running?
```

---

## 📞 Support Resources

### Documentation
- `CIBC_COMPETITION_FLOW.md` - Business requirements
- `docs/backend-spec/BACKEND_ADMIN_DASHBOARD_ARCHITECTURE.md` - Architecture
- `docs/backend-spec/BACKEND_DETAILED_SPECIFICATION.md` - Database schema
- `docs/backend-spec/BACKEND_IMPLEMENTATION_ROADMAP.md` - Implementation plan

### Prompts
- `backend-overhaul-supabase-gdrive.md` - Main overhaul prompt
- `backend-implementation.md` - Original Cloudflare backend (reference)

### External Links
- Supabase: https://supabase.com
- Google Cloud: https://console.cloud.google.com
- n8n: https://n8n.io
- Railway: https://railway.app

---

## 🎯 Next Steps

### After Backend Overhaul Complete:

1. **Admin Dashboard**
   - Build admin UI for grading
   - Submission management
   - Team management

2. **Monitoring**
   - Setup usage monitoring
   - Setup alerts for quota
   - Setup error tracking

3. **Scale**
   - Prepare for multiple competitions
   - Optimize database queries
   - Setup CDN for downloads

4. **Backup**
   - Setup automated DB backup
   - Setup Google Drive backup
   - Disaster recovery plan

---

## 🎉 Ready to Start?

**Command:**
```bash
cd /Users/mekari/kath-laddingpage
qwen-agent --prompt prompts/backend/backend-overhaul-supabase-gdrive.md
```

**Or manual:**
```bash
# 1. Copy prompt
cat prompts/backend/backend-overhaul-supabase-gdrive.md | pbcopy

# 2. Paste ke AI assistant

# 3. Follow instructions

# 4. Build amazing zero-cost backend! 🚀
```

---

**Last Updated:** March 18, 2026  
**Version:** 1.0.0  
**Status:** Ready for Implementation
